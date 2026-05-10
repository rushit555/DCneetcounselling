/**
 * College Media Upload Utility
 * Handles uploading images to the 'college-media' Supabase storage bucket
 * and saving public URLs into the colleges/gallery tables.
 *
 * Folder structure inside the bucket:
 *   /colleges/{slug}/hero/main.jpg
 *   /colleges/{slug}/gallery/1.jpg
 *
 * Performance rules:
 *   - Hero images: recommended 1200px width
 *   - Gallery images: recommended 600px width
 *   - Compress before uploading
 */

window.CollegeMediaUpload = (function () {
  'use strict';

  var BUCKET = 'college-media';
  var SUPABASE_URL = 'https://anqqmulbmeydetwpeudh.supabase.co';

  // ─── Helpers ──────────────────────────────────────────────────────────

  /**
   * Build the public URL for a file in the college-media bucket.
   * @param {string} path  – e.g. "colleges/aiims-delhi/hero/main.jpg"
   * @returns {string}
   */
  function getPublicUrl(path) {
    return SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + path;
  }

  /**
   * Compress / resize an image File or Blob in-browser.
   * Returns a Promise<Blob> in JPEG format.
   *
   * @param {File|Blob} file
   * @param {number} maxWidth
   * @param {number} quality  – 0..1
   * @returns {Promise<Blob>}
   */
  function compressImage(file, maxWidth, quality) {
    quality = quality || 0.82;
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var w = img.width;
        var h = img.height;

        if (w > maxWidth) {
          h = Math.round(h * (maxWidth / w));
          w = maxWidth;
        }

        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          function (blob) {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob returned null'));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = function () {
        reject(new Error('Failed to load image for compression'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // ─── Upload functions ─────────────────────────────────────────────────

  /**
   * Upload a hero image for a college.
   *
   * @param {string} slug        – e.g. "aiims-delhi"
   * @param {File|Blob} file     – the image file
   * @param {object} [opts]      – { maxWidth: 1200, quality: 0.82 }
   * @returns {Promise<{publicUrl: string, error: string|null}>}
   */
  async function uploadHeroImage(slug, file, opts) {
    opts = opts || {};
    var maxWidth = opts.maxWidth || 1200;
    var quality = opts.quality || 0.82;

    if (!window.supabaseClient) {
      return { publicUrl: null, error: 'Supabase client not initialised' };
    }

    try {
      // Step 1: Compress
      var compressed = await compressImage(file, maxWidth, quality);

      // Step 2: Determine file path
      var ext = 'jpg';
      var filePath = 'colleges/' + slug + '/hero/main.' + ext;

      // Step 3: Upload (upsert so re-upload overwrites)
      var { error: uploadError } = await window.supabaseClient.storage
        .from(BUCKET)
        .upload(filePath, compressed, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        return { publicUrl: null, error: uploadError.message };
      }

      // Step 4: Generate public URL
      var publicUrl = getPublicUrl(filePath);

      // Step 5: Save URL in colleges.main_image
      var { error: dbError } = await window.supabaseClient
        .from('colleges')
        .update({ main_image: publicUrl })
        .eq('slug', slug);

      if (dbError) {
        console.warn('Hero image uploaded but DB update failed:', dbError);
        return { publicUrl: publicUrl, error: 'DB update failed: ' + dbError.message };
      }

      // Bust any cached college data
      if (window.collegeDataCache && window.collegeDataCache[slug]) {
        delete window.collegeDataCache[slug];
      }

      return { publicUrl: publicUrl, error: null };
    } catch (err) {
      return { publicUrl: null, error: err.message || 'Upload failed' };
    }
  }

  /**
   * Upload a gallery image for a college.
   *
   * @param {string} slug        – e.g. "aiims-delhi"
   * @param {string} collegeId   – UUID of the college
   * @param {File|Blob} file     – the image file
   * @param {number} index       – gallery image number (1, 2, 3…)
   * @param {object} [opts]      – { maxWidth: 600, quality: 0.80 }
   * @returns {Promise<{publicUrl: string, error: string|null}>}
   */
  async function uploadGalleryImage(slug, collegeId, file, index, opts) {
    opts = opts || {};
    var maxWidth = opts.maxWidth || 600;
    var quality = opts.quality || 0.80;

    if (!window.supabaseClient) {
      return { publicUrl: null, error: 'Supabase client not initialised' };
    }

    try {
      var compressed = await compressImage(file, maxWidth, quality);
      var ext = 'jpg';
      var filePath = 'colleges/' + slug + '/gallery/' + index + '.' + ext;

      var { error: uploadError } = await window.supabaseClient.storage
        .from(BUCKET)
        .upload(filePath, compressed, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        return { publicUrl: null, error: uploadError.message };
      }

      var publicUrl = getPublicUrl(filePath);

      // Insert row into gallery table
      var { error: dbError } = await window.supabaseClient
        .from('gallery')
        .insert({ college_id: collegeId, image_url: publicUrl });

      if (dbError) {
        console.warn('Gallery image uploaded but DB insert failed:', dbError);
        return { publicUrl: publicUrl, error: 'DB insert failed: ' + dbError.message };
      }

      if (window.collegeDataCache && window.collegeDataCache[slug]) {
        delete window.collegeDataCache[slug];
      }

      return { publicUrl: publicUrl, error: null };
    } catch (err) {
      return { publicUrl: null, error: err.message || 'Upload failed' };
    }
  }

  /**
   * Bulk upload multiple gallery images.
   *
   * @param {string} slug
   * @param {string} collegeId
   * @param {FileList|Array<File>} files
   * @param {object} [opts]
   * @returns {Promise<Array<{publicUrl: string, error: string|null}>>}
   */
  async function bulkUploadGallery(slug, collegeId, files, opts) {
    var results = [];
    for (var i = 0; i < files.length; i++) {
      var result = await uploadGalleryImage(slug, collegeId, files[i], i + 1, opts);
      results.push(result);
    }
    return results;
  }

  // ─── Public API ───────────────────────────────────────────────────────

  return {
    uploadHeroImage: uploadHeroImage,
    uploadGalleryImage: uploadGalleryImage,
    bulkUploadGallery: bulkUploadGallery,
    getPublicUrl: getPublicUrl,
    compressImage: compressImage,
    BUCKET: BUCKET
  };
})();
