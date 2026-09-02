// `audio` is a basename under /public — the player tries .wav then .mp3,
// so either format works. Drop files into: public/examples/speech/
export const AUDIO_EXAMPLES = [
    {
        id: 'bhojpuri',
        label: 'Bhojpuri',
        tag: 'Bank account details · digits',
        audio: '/examples/speech/bhojpuri-bank-details',
        lang: 'bho',
        modes: {
            native:
                'हम आपन खाता के विवरण सौराष्ट्र ग्रामीण बैंक में भरल चाहत बानी हमार खाता नंबर बा जीरो एक चार दुई जीरो जीरो पांच जीरो चार आठ दुई जीरो जीरो',
            mixed: 'हम आपन खाता के विवरण सौराष्ट्र ग्रामीण बैंक में भरल चाहत बानी हमार खाता number बा 0142005048200.',
            romanized:
                'Ham apan khaata ke vivaran Saurashtra Gramin Bank mein bharal chahat baani hamar khaata number ba zero ek chaar do zero zero paanch zero chaar aath do zero zero',
        },
    },
    {
        id: 'sanskrit',
        label: 'Sanskrit',
        tag: 'Shloka · metrical recitation',
        audio: '/examples/speech/sanskrit-shlok',
        lang: 'sa',
        modes: {
            native:
                'राज्याभिषेके चलमानयन्त्या हस्ताचुकाहे न घटो युवत्या सोपानमार्गे च करोति शब्दं ट टं ट टं ट ट टं ट टं ट टं',
            mixed:
                'राज्याभिषेके चलवान् अयंत्या हस्ताचुका हे न घटो युवत्या सोपानमार्गे च करोति शब्दं ट ट ट टं ट ट ट ट ट टं ट टं टं',
            romanized:
                'Raajyaabhisheke chalavaanayantya hasta chukahe na ghato yuvatya sopanamaarge cha karoti shabdam ta ta ta ta ta ta ta ta ta taa taa',
        },
    },
    {
        id: 'tamil',
        label: 'Tamil',
        tag: 'Thirukkural · classical verse',
        audio: '/examples/speech/tamil-thirukkural',
        lang: 'ta',
        modes: {
            native:
                'அகர முதல எழுத்தெல்லாம் ஆதிபகவன் உதற்றே உலகு எழுத்துக்கள் அனைத்தும் ஆ என்ற முதல் எழுத்தை தலைமையாகக் கொண்டதாகும் அதுபோல இந்நாம் வாழும் இந்த உலகம் அனைத்தும் கடவுளை முதன்மையாகக் கொண்டதாகும்',
            mixed:
                'Agara முதல எழுத்தெல்லாம் Adi Bhagavan உதற்றே உலகு எழுத்துக்கள் அனைத்தும் A என்ற 1st எழுத்தை தலைமையாகக் கொண்டதாகும் அதுபோல இந்நாம் வாழும் இந்த உலகம் அனைத்தும் கடவுளை முதன்மையாகக் கொண்டதாகும்',
            romanized:
                'Agara mudhala ezhuthukkal anaithum aa endra mudhal ezhuthai thalaimaiyaaga kondadaagum adhupola naam vaazhum indha ulagam anaithum kadavulai mudhanmaiyaaga kondadhaagum',
        },
    },
    {
        id: 'santali',
        label: 'Santali',
        tag: 'Ol Chiki · spontaneous conversation',
        audio: '/examples/speech/santali-parcel',
        lang: 'sat',
        modes: {
            native:
                'ᱛᱚ ᱡᱚᱦᱟᱨ ᱜᱟᱛᱮ ᱠᱚ ᱛᱤᱦᱤᱧ ᱥᱮᱛᱟᱜ ᱥᱮᱛᱟᱜ ᱯᱟᱨᱥᱮᱞ ᱵᱟᱞᱟ ᱦᱮᱡ ᱮᱱᱟᱭ ᱯᱷᱞᱤᱯᱠᱟᱨᱴ ᱠᱷᱚᱱ ᱚᱰᱟᱨ ᱠᱟᱜ ᱛᱟᱦᱮᱱᱟ ᱥᱩᱴ ᱢᱤᱫᱴᱮᱱ ᱫᱚ ᱦᱚᱞᱟ ᱜᱮ ᱦᱮᱡ ᱠᱟᱱ ᱛᱟᱦᱮᱱᱟ ᱪᱚᱞᱚ ᱵᱟᱱᱟᱨ ᱤᱭᱟᱹ ᱨᱟᱲᱟ ᱠᱟᱛᱮᱧ ᱩᱛᱩ ᱯᱮ ᱠᱟᱱᱟ ᱪᱚᱞᱚ ᱛᱚᱵᱮ ᱱᱤᱭᱟᱹ ᱧᱮᱞ ᱛᱟᱵᱚᱱ ᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ ᱱᱤᱭᱟᱹ ᱱᱤᱭᱟᱹ ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱱᱟᱦᱟᱜ ᱛᱟᱭᱚᱢ ᱛᱮᱧ ᱩᱛᱩ ᱯᱮᱭᱟ ᱪᱚᱞᱚ ᱛᱚᱵᱮ ᱥᱩᱴ ᱵᱚᱱ ᱧᱮᱞ ᱠᱟᱜ ᱞᱮᱜᱮ ᱟᱨ ᱛᱚᱵᱮ ᱱ',
            mixed:
                'ᱛᱚ ᱡᱚᱦᱟᱨ ᱜᱟᱛᱮ ᱠᱚ ᱛᱤᱦᱤᱧ ᱥᱮᱛᱟᱜ ᱥᱮᱛᱟᱜ parcel ᱵᱟᱞᱟ ᱦᱮᱡ ᱮᱱᱟ Flipkart ᱠᱷᱚᱱ ᱚᱰᱟᱨ ᱠᱟᱜ ᱛᱟᱦᱮᱱᱟ suit 1 ᱫᱤᱱ ᱫᱚ ᱦᱚᱞᱟ ᱜᱮ ᱦᱮᱡ ᱠᱟᱱ ᱛᱟᱦᱮᱱᱟ ᱪᱚᱞᱚ ᱵᱟᱱᱟᱨ ᱤᱭᱟᱹ ᱨᱟᱲᱟ ᱠᱟᱛᱮᱧ ᱩᱛᱩ ᱯᱮ ᱠᱟᱱᱟ ᱪᱚᱞᱚ ᱛᱚᱵᱮ ᱱᱤᱭᱟᱹ ᱧᱮᱞ ᱛᱟᱵᱚᱱ ᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ ᱱᱤᱭᱟᱹ ᱱᱤᱭᱟᱹ ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱱᱟᱦᱟᱜ ᱛᱟᱭᱚᱢ ᱛᱮᱧ ᱩᱛᱩ ᱯᱮᱭᱟ ᱪᱚᱞᱚ ᱛᱚᱵᱮ suit ᱵᱚᱱ ᱧᱮᱞ ᱠᱟᱜ ᱞᱮᱜᱮ ᱟᱨ ᱛᱚᱵᱮ ᱱᱤᱭᱟᱹ suit',
            romanized:
                'To johar gate ko tehenj taste parcel bala hej ena Flipkart koy order kag tahena suit Midten do hola ge hej kan tahena cholo banar iya rara kateg iny udug pe kana Cholo tobe niya nyel tabon pe ched leka nyelog kana Niya niya horog kateg tahen doy udug pe cholo tobe suit bon nyel kag ge Ar tobe niya suit nyel tabon pe ched leka',
        },
    },
];

export const MODE_LABELS = [
    { id: 'native', label: 'Native script' },
    { id: 'mixed', label: 'Mixed script' },
    { id: 'romanized', label: 'Romanized' },
];
