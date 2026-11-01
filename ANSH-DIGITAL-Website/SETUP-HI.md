# ANSH DIGITAL — सेटअप गाइड (Hindi)

यह वेबसाइट Vite + React पर बनी है। Netlify पर deploy हो सकती है। Video upload और Admin Dashboard चालू करने के लिए Supabase credentials जोड़ने होंगे।

## 1. अपने कंप्यूटर पर चलाएँ
1. Node.js LTS इंस्टॉल करें: https://nodejs.org/
2. इस प्रोजेक्ट के folder में Terminal खोलें।
3. `npm install` चलाएँ।
4. `.env.example` की कॉपी बनाकर उसका नाम `.env` रखें।
5. Supabase URL, anon key और WhatsApp नंबर भरें।
6. `npm run dev` चलाएँ और browser में दिखाई गई local URL खोलें।

## 2. Supabase सेटअप — वीडियो और Admin
1. https://supabase.com पर नया project बनाएँ।
2. Project → SQL Editor खोलें और `supabase/schema.sql` का पूरा SQL Run करें।
3. Authentication → Users में अपना Admin user बनाएँ (email + strong password)।
4. Project Settings → API से Project URL और anon/public key कॉपी करें।
5. `.env` में `VITE_SUPABASE_URL` और `VITE_SUPABASE_ANON_KEY` भरें।
6. Admin dashboard खोलने के लिए वेबसाइट के नीचे दाईं ओर shield icon दबाएँ और बनाए गए Admin user से login करें।
7. Dashboard से MP4/WebM/MOV वीडियो (अधिकतम 150 MB) और optional thumbnail upload करें।

**महत्वपूर्ण सुरक्षा:** Supabase `service_role` key कभी भी वेबसाइट या Netlify में `VITE_` variable के रूप में न डालें। केवल anon/public key इस्तेमाल करें। Admin user का password निजी रखें। इस शुरुआती संस्करण में authenticated users को upload/delete की अनुमति है; इसलिए Supabase Auth में केवल अपना भरोसेमंद Admin user बनाएँ।

## 3. Netlify पर Publish
1. Project को GitHub repository में push करें।
2. Netlify → Add new site → Import an existing project → GitHub चुनें।
3. Repository चुनें। Build command `npm run build`, Publish directory `dist` रखें (netlify.toml में पहले से मौजूद है)।
4. Site configuration → Environment variables में ये variables जोड़ें:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER` (उदाहरण: `919876543210`, अपना असली नंबर डालें)
5. Deploy करें। Environment variables जोड़ने/बदलने के बाद नया deploy करें।

## 4. Custom Domain जोड़ें
1. Netlify → Site configuration → Domain management → Add a domain चुनें।
2. अपना खरीदा हुआ domain (जैसे `anshdigital.in`, यदि उपलब्ध हो) जोड़ें।
3. Netlify द्वारा दिखाए गए DNS records अपने domain registrar में सेट करें।
4. DNS verify होने और HTTPS certificate बनने तक प्रतीक्षा करें।

## 5. अपनी वेबसाइट को पूरा करें
- Demo portfolio cards को अपने वास्तविक काम से बदलने के लिए Admin dashboard से वीडियो upload करें।
- WhatsApp नंबर `.env` या Netlify environment variables में सही country code सहित डालें।
- Social media links और agency contact details को `src/main.jsx` में अपने असली links से अपडेट करें।
- अपना logo, client testimonials और वास्तविक case studies तभी जोड़ें जब वे उपलब्ध हों।

## वर्तमान starter की सीमाएँ
- Domain खरीदा/जुड़ा नहीं है; यह Netlify account और domain ownership से होगा।
- इस परियोजना में WhatsApp number placeholder है जब तक आप असली नंबर सेट नहीं करते।
- Video upload के लिए Supabase project और environment variables आवश्यक हैं।
- शुरुआती upload flow 150 MB तक की फाइल के लिए है। बड़े वीडियो के लिए dedicated video hosting / resumable upload व्यवस्था बेहतर होगी।
