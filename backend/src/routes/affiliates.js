const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// POST /api/register-affiliate
router.post('/register-affiliate', async (req, res) => {
    try {
        let { name, email, ref_code, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // 1. Check if email exists
        const { data: existingEmail, error: searchError } = await supabase
            .from('affiliates')
            .select('email')
            .eq('email', email)
            .single();

        if (existingEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered'
            });
        }

        // 1.5 Auto-generate unique ref_code
        async function generateUniqueRefCode(baseName) {
            let isUnique = false;
            let code = baseName.replace(/\s+/g, '').toUpperCase();
            
            // First try the user's requested ref_code if provided
            if (ref_code) {
                code = ref_code.trim().toUpperCase();
            }

            while (!isUnique) {
                const { data } = await supabase
                    .from('affiliates')
                    .select('id')
                    .eq('ref_code', code)
                    .single();

                if (!data) {
                    isUnique = true;
                } else {
                    const random = Math.floor(1000 + Math.random() * 9000);
                    code = baseName.replace(/\s+/g, '').toUpperCase() + random;
                }
            }
            return code;
        }

        const final_ref_code = await generateUniqueRefCode(name);

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert new affiliate with 'pending' status
        const { error: insertError } = await supabase
            .from('affiliates')
            .insert({
                name,
                email,
                ref_code: final_ref_code,
                password: hashedPassword,
                commission_type: 'percentage',
                commission_value: 10,
                status: 'pending'
            });

        if (insertError) throw insertError;

        // 3. Response
        res.status(200).json({
            success: true,
            message: "Registration submitted. Await approval."
        });

    } catch (err) {
        console.error('Affiliate Registration Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/login-affiliate
router.post('/login-affiliate', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const { data: affiliate, error } = await supabase
            .from('affiliates')
            .select('ref_code, status, password')
            .eq('email', email)
            .single();

        if (error || !affiliate) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        if (!affiliate.password) {
            return res.status(400).json({ success: false, message: 'Account is old. Please contact support.' });
        }

        const validPassword = await bcrypt.compare(password, affiliate.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        if (affiliate.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Your account is pending approval.' });
        }

        res.status(200).json({
            success: true,
            ref_code: affiliate.ref_code
        });

    } catch (err) {
        console.error('Affiliate Login Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/get-affiliate-coupons
router.post('/get-affiliate-coupons', async (req, res) => {
    try {
        let { ref_code } = req.body;

        if (!ref_code) {
            return res.status(400).json({ success: false, message: 'Ref code required' });
        }

        ref_code = ref_code.toUpperCase();

        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('affiliate_ref', ref_code);

        if (error) {
            return res.json({ success: false, message: 'Error fetching coupons' });
        }

        res.json({ success: true, coupons: data || [] });
    } catch (err) {
        console.error('Coupon fetch error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
