// دالة لحساب نسبة التشابه بين كلمتين
function similarity(str1, str2) {
    const longer = Math.max(str1.length, str2.length);
    if (longer === 0) return 1.0; // إذا كانت الكلمتان فارغتين
    const distance = levenshteinDistance(str1, str2);
    return (longer - distance) / longer; // حساب نسبة التشابه
}

// دالة لحساب مسافة ليفينشتاين بين كلمتين
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= a.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]; // لا تغيير
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // استبدال
                    Math.min(
                        matrix[i - 1][j] + 1, // حذف
                        matrix[i][j - 1] + 1 // إضافة
                    )
                );
            }
        }
    }
    return matrix[a.length][b.length];
}

// مصفوفة الأعراض تحتوي على الكلمات المفتاحية لكل عرض والنصيحة المقابلة له
const symptomsDatabase = {
    'حمى': {
        keywords: ['حمى', 'حرارة', 'سخونة', 'حراره'],
        message: 'قد تشير الأعراض إلى عدوى. يُنصح بزيارة الطبيب.'
    },
    'صداع': {
        keywords: ['صداع', 'دوخة', 'وجع راس'],
        message: 'قد تكون تعاني من إجهاد أو صداع نصفي. تأكد من الراحة والترطيب.'
    },
    'كحة': {
        keywords: ['كحة', 'سعال', 'كحه', 'كحة جافة'],
        message: 'قد يكون لديك أعراض برد. حاول شرب السوائل الدافئة.'
    },
    'آلام في الجسم': {
        keywords: ['الم في الجسم', 'تعب', 'الم عام'],
        message: 'يمكن أن تكون نتيجة لعدوى أو إرهاق. حاول الاسترخاء.'
    },
    'غثيان': {
        keywords: ['غثيان', 'دوار', 'ميل للقيء', 'استفراغ'],
        message: 'قد يكون لديك مشكلة في المعدة. اشرب سوائل وارتاح.'
    },
    'إسهال': {
        keywords: ['اسهال', 'تلبك معوي', 'اسهال مستمر'],
        message: 'تأكد من شرب السوائل. إذا استمر، عليك مراجعة طبيب.'
    },
    'ألم في الصدر': {
        keywords: ['الم في الصدر', 'ضيق في الصدر', 'حرقة'],
        message: 'قد يكون علامة على حالة طبية خطيرة. اتصل بالطبيب أو توجه إلى الطوارئ.'
    },
    'آلام الظهر': {
        keywords: ['الم في الظهر', 'آلام الظهر', 'وجع ظهر'],
        message: 'قد يكون لديك توتر عضلي أو إجهاد. حاول الاسترخاء وقم بممارسة تمارين الإطالة.'
    },
    'آلام العظام': {
        keywords: ['الم في العظام', 'آلام العظام', 'وجع عظام'],
        message: 'يمكن أن تكون نتيجة لإجهاد أو التهاب. يفضل استشارة الطبيب إذا استمرت.'
    },
    'آلام نفسية': {
        keywords: ['آلام نفسية', 'تعب نفسي', 'ضغوط نفسية', 'اكتئاب'],
        message: 'من المهم التحدث مع مختص نفسي. حاول ممارسة الأنشطة المريحة.'
    },
    // أضف المزيد من الأعراض حسب الحاجة
};

// دالة تحليل الأعراض
function analyzeSymptoms() {
    const symptomsInput = document.getElementById("symptoms-input").value.toLowerCase();
    const diagnosisResult = document.getElementById("diagnosis-result");

    // تقسيم الأعراض المدخلة إلى مصفوفة باستخدام المسافات
    const symptomsArray = symptomsInput.split(' ').map(symptom => symptom.trim());
    const results = new Set(); // استخدام مجموعة لتخزين النصائح

    // مقارنة كل عرض مدخل بالكلمات المفتاحية لكل عرض في مصفوفة الأعراض
    symptomsArray.forEach(inputSymptom => {
        let foundMatch = false;

        for (let symptom in symptomsDatabase) {
            const { keywords, message } = symptomsDatabase[symptom];

            // البحث عن أي كلمة مفتاحية تتشابه مع المدخل
            if (keywords.some(keyword => {
                return similarity(inputSymptom, keyword) >= 0.5; // تحقق مما إذا كانت نسبة التشابه 50% أو أكثر
            })) {
                results.add(message); // إضافة النصيحة إلى المجموعة
                foundMatch = true;
                break;
            }
        }

        // إذا لم يتم العثور على تطابق
        if (!foundMatch) {
            results.add('لا توجد معلومات متاحة.');
        }
    });

    // إظهار النتائج
    diagnosisResult.textContent = Array.from(results).join('\n');
}

// دالة لإعادة ضبط الحقول
function resetFields() {
    document.getElementById("symptoms-input").value = "";
    document.getElementById("diagnosis-result").textContent = "";
}
