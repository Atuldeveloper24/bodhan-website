export const SENTENCES = [
    {
        id: 'hindi',
        label: 'Hindi',
        from: 'English',
        to: 'Hindi',
        lang: 'hi',
        source: 'Indus Valley Civilisation is known for its technological knowledge in a variety of fields.',
        output: 'सिंधु घाटी सभ्यता विभिन्न क्षेत्रों में अपने तकनीकी ज्ञान के लिए जानी जाती है।',
    },
    {
        id: 'kannada',
        label: 'Kannada',
        from: 'English',
        to: 'Kannada',
        lang: 'kn',
        source: 'Hitopadesa is a book of worldly wisdom presented through the characters of birds, animals, and humans.',
        output:
            'ಹಿಟೋಪದೇಶವು ಪಕ್ಷಿಗಳು, ಪ್ರಾಣಿಗಳು ಮತ್ತು ಮನುಷ್ಯರ ಪಾತ್ರಗಳ ಮೂಲಕ ಪ್ರಸ್ತುತಪಡಿಸಲಾದ ಲೌಕಿಕ ಜ್ಞಾನದ ಪುಸ್ತಕವಾಗಿದೆ.',
    },
    {
        id: 'tamil',
        label: 'Tamil',
        from: 'English',
        to: 'Tamil',
        lang: 'ta',
        source: 'The Bagh Caves, consisting of Buddhist mural paintings, are located 97 km from the Dhar district of Madhya Pradesh.',
        output:
            'பௌத்த சுவரோவியங்களைக் கொண்ட பாக் குகைகள் மத்தியப் பிரதேசத்தின் தார் மாவட்டத்திலிருந்து 97 கி.மீ தொலைவில் அமைந்துள்ளன.',
    },
    {
        id: 'sanskrit',
        label: 'Sanskrit',
        from: 'English',
        to: 'Sanskrit',
        lang: 'sa',
        source: 'The purpose of the book appears to encourage proficiency in Sanskrit expression and the knowledge of wise behaviour.',
        output: 'पुस्तकस्य उद्देश्यं संस्कृतव्यञ्जने प्रवीणतां, बुद्धिमत्तापूर्णव्यवहारज्ञानं च प्रोत्साहयति इति प्रतीयते।',
    },
    {
        id: 'hindi-english',
        label: 'Hindi → English',
        from: 'Hindi',
        to: 'English',
        lang: 'en',
        source: 'हाल के वर्षों में, रुपये की विनिमय दर तथा विदेशी मुद्रा आरक्षित भंडार की पर्याप्तता पर भिन्न-भिन्न दृष्टिकोण सामने आए हैं।',
        output:
            'In recent years, there have been varying perspectives on the exchange rate of the rupee and the adequacy of foreign exchange reserves.',
    },
];

export const DOCUMENT = {
    label: 'English → Tamil',
    targetLang: 'ta',
    preserved: ['Headings', 'Numbered lists', 'Inline code', 'Blockquote', 'Link targets', 'HTML anchors'],
    source: `# Data Retention and Deletion Policy (Draft)

## Summary

This policy note outlines the organization's approach to data retention, periodic review, and secure deletion. It is intended to ensure compliance with applicable laws, protect individual privacy, and minimize unnecessary storage of historical records.

<a name="scope"></a>
## Scope

The scope of this policy includes customer records, employee records, transactional logs, backups, and analytics data. For an itemized schedule, see the [Retention Schedule](https://company.example/policies/retention).

> Principle: retain only what is necessary, for as long as required, and dispose of it securely when it is no longer needed.

## Definitions

- \`PII\`: personally identifiable information, including names, email addresses, national identifiers, and equivalent identifiers.
- Retention period: the required time for which a given record must be kept before deletion.
- Archival storage: a lower-cost storage tier where records are preserved beyond active business use but prior to final deletion.

## Retention Schedule (high level)

1. Customer account data: retain for the life of the account plus 2 years for dispute resolution.
2. Financial and tax records: retain for a minimum of 7 years in accordance with accounting rules.
3. Employee personnel records: retain for 6 years after termination unless otherwise required by law.
4. System logs and telemetry: retain raw logs for 90 days, aggregated telemetry for 3 years.

### Special categories

- Health data subject to HIPAA: retain and delete according to legal counsel guidance and secure deletion protocols.
- Data subject to litigation hold: suspend regular deletion until the hold is lifted.

## Data Deletion Procedures

When a record reaches the end of its retention period, it must be deleted or anonymized using the following steps:

1. Verify the retention metadata and confirm no holds or exceptions apply.
2. If eligible, move the record to the secure deletion queue.
3. Execute deletion using approved tools; example command for archival expiry might be \`archive --expire 7y\`.
4. Log the deletion event, including responsible operator ID, timestamp, and scope.`,
    target: `# தரவு தக்கவைப்பு மற்றும் நீக்குதல் கொள்கை (வரைவு)

## சுருக்கம்

இந்தக் கொள்கைக் குறிப்பு, தரவு தக்கவைப்பு, அவ்வப்போது மதிப்பாய்வு செய்தல் மற்றும் பாதுகாப்பான நீக்குதல் ஆகியவற்றில் நிறுவனத்தின் அணுகுமுறையை கோடிட்டுக் காட்டுகிறது. இது பொருந்தக்கூடிய சட்டங்களுக்கு இணங்குவதை உறுதி செய்வதற்கும், தனிநபர் தனியுரிமையைப் பாதுகாப்பதற்கும், வரலாற்றுப் பதிவுகளைத் தேவையற்ற முறையில் சேமிப்பதைத் குறைப்பதற்கும் நோக்கம் கொண்டுள்ளது.

<a name="scope"></a>
## வரம்பு

இந்தக் கொள்கையின் வரம்பில் வாடிக்கையாளர் பதிவுகள், பணியாளர் பதிவுகள், பரிவர்த்தனைப் பதிவுகள், காப்புப் பிரதிகள் மற்றும் பகுப்பாய்வுத் தரவுகள் ஆகியவை அடங்கும். விரிவான அட்டவணைக்கு, [தக்கவைப்பு அட்டவணை](https://company.example/policies/retention) என்பதைப் பார்க்கவும்.

> கொள்கை: தேவைப்படும் வரை, தேவையானவற்றை மட்டுமே தக்கவைத்துக் கொள்ளவும், மேலும் அவை இனி தேவையில்லை என்றதும் பாதுகாப்பாக அவற்றை அப்புறப்படுத்தவும்.

## வரையறைகள்

- \`PII\`: பெயர்கள், மின்னஞ்சல் முகவரிகள், தேசிய அடையாளங்காட்டிகள் மற்றும் அதற்கு இணையான அடையாளங்காட்டிகள் உள்ளிட்ட தனிநபர் அடையாளம் காணக்கூடிய தகவல்.
- தக்கவைப்பு காலம்: ஒரு குறிப்பிட்ட பதிவை நீக்குவதற்கு முன்பு எவ்வளவு காலம் வைத்திருக்க வேண்டும் என்பதற்கான தேவையான நேரம்.
- ஆவணக் காப்பக சேமிப்பு: பதிவுகள் செயலில் உள்ள வணிகப் பயன்பாட்டிற்குப் பிறகும், ஆனால் இறுதி நீக்கத்திற்கு முன்பும் பாதுகாக்கப்படும் குறைந்த செலவுடைய சேமிப்பக அடுக்கு.

## தக்கவைப்பு அட்டவணை (உயர் நிலை)

1. வாடிக்கையாளர் கணக்குத் தரவு: கணக்கின் ஆயுட்காலம் மற்றும் தகராறு தீர்வுக்காகக் கூடுதலாக 2 ஆண்டுகள் தக்கவைத்துக் கொள்ளவும்.
2. நிதி மற்றும் வரிப் பதிவுகள்: கணக்கியல் விதிகளின்படி குறைந்தபட்சம் 7 ஆண்டுகள் தக்கவைத்துக் கொள்ளவும்.
3. பணியாளர் ஆவணப் பதிவுகள்: சட்டத்தால் வேறுவிதமாகத் தேவைப்பட்டால் ஒழிய, பணிநீக்கம் செய்யப்பட்ட பிறகு 6 ஆண்டுகள் தக்கவைத்துக் கொள்ளவும்.
4. கணினிப் பதிவுகள் மற்றும் தொலை அளவீடுகள்: மூலப் பதிவுகளை 90 நாட்களுக்கும், ஒருங்கிணைக்கப்பட்ட தொலை அளவீடுகளை 3 ஆண்டுகளுக்கும் தக்கவைத்துக் கொள்ளவும்.

### சிறப்புப் பிரிவுகள்

- HIPAA-க்கு உட்பட்ட சுகாதாரத் தரவு: சட்ட ஆலோசகரின் வழிகாட்டுதல் மற்றும் பாதுகாப்பான நீக்குதல் நெறிமுறைகளின்படி தக்கவைத்துக் கொள்ளவும் மற்றும் நீக்கவும்.
- வழக்குத் தொடரப்படுவதற்கான தரவு: வழக்குத் தடை நீக்கப்படும் வரை வழக்கமான நீக்கத்தை நிறுத்தி வைக்கவும்.

## தரவு நீக்குதல் நடைமுறைகள்

ஒரு பதிவு அதன் தக்கவைப்பு காலத்தின் முடிவை அடையும்போது, பின்வரும் படிகளைப் பயன்படுத்தி அது நீக்கப்பட வேண்டும் அல்லது அநாமதேயமாக்கப்பட வேண்டும்:

1. தக்கவைப்பு மெட்டாடேட்டாவைச் சரிபார்த்து, எந்தத் தடைகள் அல்லது விதிவிலக்குகளும் பொருந்தாது என்பதை உறுதிப்படுத்தவும்.
2. தகுதியுடையதாக இருந்தால், பதிவை பாதுகாப்பான நீக்குதல் வரிசைக்கு நகர்த்தவும்.
3. அங்கீகரிக்கப்பட்ட கருவிகளைப் பயன்படுத்தி நீக்குதலைச் செயல்படுத்தவும்; ஆவணக் காப்பக காலாவதிக்கு எடுத்துக்காட்டாக \`archive --expire 7y\` என்ற கட்டளை இருக்கலாம்.
4. பொறுப்பான ஆபரேட்டர் ID, நேர முத்திரை மற்றும் வரம்பு உள்ளிட்ட நீக்குதல் நிகழ்வைப் பதிவு செய்யவும்.`,
};
