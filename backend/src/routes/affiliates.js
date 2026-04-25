const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// POST /api/register-affiliate
router.post('/register-affiliate', async (req, res) => {
    try {
        const { name, email, ref_code } = req.body;

        if (!name || !email || !ref_code) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // 1. Check if email or ref_code already exists
        const { data: existing, error: searchError } = await supabase
            .from('affiliates')
            .select('email, ref_code')
            .or(`email.eq.${email},ref_code.eq.${ref_code}`)
            .limit(1);

        if (searchError) throw searchError;

        if (existing && existing.length > 0) {
            const isEmail = existing[0].email === email;
            return res.status(400).json({ 
                success: false, 
                message: isEmail ? 'Email already registered' : 'Ref code already taken'
            });
        }

        // 2. Insert new affiliate with 'pending' status
        const { error: insertError } = await supabase
            .from('affiliates')
            .insert({
                name,
                email,
                ref_code: ref_code.trim().toUpperCase(),
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

module.exports = router;
