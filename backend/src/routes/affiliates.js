const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// POST /api/register-affiliate
router.post('/register-affiliate', async (req, res) => {
    try {
        const { name, email, ref_code, password } = req.body;

        if (!name || !email || !ref_code || !password) {
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

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert new affiliate with 'pending' status and password
        const { error: insertError } = await supabase
            .from('affiliates')
            .insert({
                name,
                email,
                ref_code: ref_code.trim().toUpperCase(),
                commission_type: 'percentage',
                commission_value: 10,
                status: 'pending',
                password: hashedPassword
            });

        if (insertError) throw insertError;

        // 4. Response
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

module.exports = router;
