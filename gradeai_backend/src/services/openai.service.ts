import OpenAI from 'openai'

import {OPENAI_API_KEY} from '../utils/secrets'
import {logger} from '../utils/logger'

const openai = new OpenAI({apiKey: OPENAI_API_KEY})

const MODEL = 'gpt-4o'

const SUBJECT_PROMPTS: Record<string, string> = {
  Matematika: `
Baholash mezonlari:
- Har bir masalaning yechim BOSQICHLARINI tekshir (faqat javob emas, yechim jarayoni ham muhim)
- Formulalar to'g'ri ishlatilganmi
- Hisob-kitob xatolari (arifmetik xatolar)
- Javob to'g'ri formatdami (birlik, kasr, butun son)
- Agar grafik/chizma bo'lsa — o'qlar, masshtab, to'g'ri nuqtalar tekshiriladi

Xato turlari va ball kamaytirish:
- Formulani noto'g'ri ishlatish: -2 ball
- Arifmetik xato (hisob xatosi): -1 ball har bir xato uchun
- Yechim bosqichi tushirib qoldirilgan: -1.5 ball
- Javob yozilmagan: -1 ball
- Birlik yozilmagan yoki noto'g'ri: -0.5 ball`,

  Algebra: `
Baholash mezonlari:
- Tenglamalar to'g'ri yechilganmi (bosqichma-bosqich)
- Algebraik amallar qoidalariga rioya qilinganmi
- O'zgaruvchilar to'g'ri almashtirilganmi
- Tengsizliklar, funksiyalar, grafik tahlili

Xato turlari:
- Algebraik amal xatosi: -1.5 ball
- Bosqich tushirib qoldirilgan: -1 ball
- Javob tekshirilmagan (substitution): -0.5 ball`,

  Geometriya: `
Baholash mezonlari:
- Shakllar to'g'ri chizilganmi
- Teorema va formulalar to'g'ri qo'llanilganmi
- Burchak, tomonlar, yuza, hajm hisobi
- Isbotlar mantiqiy ketma-ketlikda berilganmi

Xato turlari:
- Teorema noto'g'ri qo'llanilgan: -2 ball
- Chizma xatosi: -1 ball
- Hisob xatosi: -1 ball`,

  Fizika: `
Baholash mezonlari:
- To'g'ri formula tanlangan va ishlatilganmi
- O'lchov birliklari (SI tizimi) to'g'ri ishlatilganmi
- Fizik qonunlar to'g'ri tushunilganmi
- Hisob-kitob bosqichlari ko'rsatilganmi
- Javobdagi birlik to'g'rimi

Xato turlari:
- Noto'g'ri formula: -2 ball
- Birlik xatosi (masalan, metrni km ga almashtirishda): -1 ball
- Fizik mantiq xatosi: -1.5 ball
- Hisob xatosi: -1 ball`,

  Kimyo: `
Baholash mezonlari:
- Kimyoviy reaksiya tenglamalari to'g'ri yozilganmi
- Tenglamalar muvozanatlanganmi (koeffitsientlar)
- Mol hisoblari to'g'rimi
- Element va birikmalar nomlanishi to'g'rimi
- Oksidlanish darajasi to'g'ri aniqlanganmi

Xato turlari:
- Muvozanatsiz tenglama: -1.5 ball
- Mol hisob xatosi: -1 ball
- Element noto'g'ri nomlangan: -0.5 ball`,

  Biologiya: `
Baholash mezonlari:
- Ilmiy atamalar to'g'ri ishlatilganmi
- Biologik jarayonlar ketma-ketligi to'g'rimi
- Tushunchalar batafsil va aniq ifodalanganmi
- Chizmalar (hujayra, organ) to'g'ri belgilanganmi
- Sabab-natija aloqasi to'g'ri ko'rsatilganmi

Xato turlari:
- Atama noto'g'ri ishlatilgan: -1 ball
- Jarayon ketma-ketligi buzilgan: -1.5 ball
- Tushuncha chala yoki noto'g'ri: -1 ball`,

  Informatika: `
Baholash mezonlari:
- Algoritm mantiqan to'g'rimi
- Kod sintaksisi to'g'rimi (agar kod bo'lsa)
- Ma'lumotlar tuzilmasi to'g'ri tanlanganmi
- Dastur kutilgan natijani beradimi
- Vaqt va xotira samaradorligi

Xato turlari:
- Mantiqiy xato: -2 ball
- Sintaksis xatosi: -1 ball
- Samarasiz yechim (ishlaydi lekin optimal emas): -0.5 ball`,

  'Ingliz tili': `
Baholash mezonlari:
- Grammatika to'g'riligi (tense, articles, prepositions, word order)
- Leksika darajasi va mos so'z tanlash
- Spelling (imlo) xatolari
- Yozuv uslubi (formal/informal mos kelishi)
- Gaplar tuzilishi (sentence structure)
- Agar essay bo'lsa — introduction, body, conclusion bormi

Xato turlari:
- Grammatika xatosi (tense, agreement): -1 ball har biri
- Spelling xatosi: -0.5 ball har biri
- Noto'g'ri so'z ishlatish: -0.5 ball
- Gaplar tuzilishi buzilgan: -1 ball`,

  'Ona tili': `
Baholash mezonlari:
- Imlo qoidalariga rioya qilinganmi
- Tinish belgilari to'g'ri qo'yilganmi
- So'z birikmalari va gaplar grammatik to'g'rimi
- Matn mazmuni mavzuga mosmi
- Badiiy ifoda vositalari (agar insho bo'lsa)

Xato turlari:
- Imlo xatosi: -0.5 ball
- Tinish belgisi xatosi: -0.5 ball
- Grammatik xato: -1 ball
- Mavzudan chetlashish: -1.5 ball`,

  'Rus tili': `
Критерии оценки:
- Правильность орфографии
- Правильность пунктуации
- Грамматическая корректность (падежи, спряжения, согласование)
- Лексическое богатство
- Соответствие теме задания

Типы ошибок:
- Орфографическая ошибка: -0.5 балл
- Пунктуационная ошибка: -0.5 балл
- Грамматическая ошибка: -1 балл
- Несоответствие теме: -1.5 балл`,

  Tarix: `
Baholash mezonlari:
- Sanalar to'g'ri ko'rsatilganmi
- Tarixiy voqealar ketma-ketligi to'g'rimi
- Shaxslar va ularning roli to'g'ri ifodalanganmi
- Sabab-natija aloqasi tahlil qilinganmi
- Dalillar bilan asoslanganmi

Xato turlari:
- Sana xatosi: -1 ball
- Voqea ketma-ketligi buzilgan: -1 ball
- Shaxs noto'g'ri ko'rsatilgan: -1 ball
- Tahlil yo'q (faqat faktlar sanab o'tilgan): -1.5 ball`,

  Geografiya: `
Baholash mezonlari:
- Geografik atamalar to'g'ri ishlatilganmi
- Xarita bilan ishlash ko'nikmalari
- Statistik ma'lumotlar to'g'rimi
- Tabiat hodisalari va jarayonlari tushuntirilganmi
- Mamlakatlar, poytaxtlar, geografik ob'ektlar to'g'rimi

Xato turlari:
- Geografik ob'ekt noto'g'ri: -1 ball
- Atama xatosi: -0.5 ball
- Statistik xato: -1 ball`,

  Adabiyot: `
Baholash mezonlari:
- Asar mazmuni to'g'ri tushunilganmi
- Personajlar tahlili
- Badiiy vositalar (metafora, epithet, sifatlash) aniqlanganmi
- Shaxsiy fikr va tahlil bormi
- Yozuv madaniyati va uslubi

Xato turlari:
- Asar mazmuni noto'g'ri talqin qilingan: -2 ball
- Personaj tahlili yo'q: -1 ball
- Shaxsiy fikr yo'q: -1 ball`,

  Iqtisodiyot: `
Baholash mezonlari:
- Iqtisodiy tushunchalar to'g'ri ishlatilganmi
- Grafik va diagrammalar to'g'ri tahlil qilinganmi
- Formulalar va hisob-kitoblar to'g'rimi
- Nazariy bilim amaliy misollar bilan bog'langanmi

Xato turlari:
- Tushuncha xatosi: -1 ball
- Hisob xatosi: -1 ball
- Grafik tahlili noto'g'ri: -1.5 ball`,

  Huquq: `
Baholash mezonlari:
- Qonun va moddalar to'g'ri ko'rsatilganmi
- Huquqiy atamalar to'g'ri ishlatilganmi
- Vaziyatlar tahlili (case study) mantiqiymi
- Javob asoslangan va dalilliymi

Xato turlari:
- Qonun noto'g'ri ko'rsatilgan: -1.5 ball
- Atama xatosi: -1 ball
- Asos yo'q: -1 ball`,

  Chizmachilik: `
Baholash mezonlari:
- Chizma texnik qoidalarga mosmi
- O'lchamlar to'g'ri ko'rsatilganmi
- Chiziq turlari to'g'ri ishlatilganmi (asosiy, yordamchi, o'q)
- Masshtab saqlangan mi
- Proyeksiyalar to'g'rimi

Xato turlari:
- O'lcham xatosi: -1 ball
- Proyeksiya xatosi: -1.5 ball
- Chiziq turi noto'g'ri: -0.5 ball`,

  Tarbiya: `
Baholash mezonlari:
- Mavzu to'g'ri tushunilganmi
- Fikrlar mantiqiy va izchilmi
- Hayotiy misollar keltirilganmi
- Axloqiy qadriyatlar to'g'ri ifodalanganmi

Xato turlari:
- Mavzudan chetlashish: -1.5 ball
- Misollar yo'q: -1 ball
- Fikr izchil emas: -1 ball`,
}

function buildAnalyzePrompt(subject: string): string {
  const subjectRules = SUBJECT_PROMPTS[subject] || ''

  return `Sen professional ${subject} fani bo'yicha tajribali o'qituvchi yordamchisisisan.

VAZIFANG: Teacher yuklagan vazifa rasmini tahlil qilib, quyidagi ma'lumotlarni JSON formatda qaytar:

1. "topic" — rasmda ko'rinayotgan mavzu nomi (masalan: "Kvadrat tenglamalar", "Present Perfect Tense")
2. "task_type" — vazifa turi (masalan: "masala yechish", "test", "insho", "tarjima", "to'ldirish")
3. "context" — BATAFSIL etalon javob tavsifi. Bu matn keyinchalik o'quvchi javobini tekshirish uchun ASOS bo'ladi.
   Context quyidagilarni o'z ichiga olishi KERAK:
   - Har bir savol/topshiriq uchun TO'G'RI JAVOB
   - Yechim bosqichlari (agar masala bo'lsa)
   - Muhim kalit so'zlar va atamalar
   - Kutilayotgan javob formati

Fan: ${subject}
${subjectRules ? `\n${subject} fani bo'yicha qo'shimcha ko'rsatmalar:\n${subjectRules}` : ''}

JAVOB FORMATI (faqat JSON, boshqa hech narsa yo'q):
{
  "topic": "mavzu nomi",
  "task_type": "vazifa turi",
  "context": "batafsil etalon javob tavsifi..."
}`
}

function buildGradePrompt(subject: string, taskContext: string): string {
  const subjectRules = SUBJECT_PROMPTS[subject] || ''

  return `Sen professional ${subject} fani o'qituvchisi yordamchisisisan. O'quvchining javobini baholamoqchisan.

VAZIFA KONTEKSTI (etalon javob):
${taskContext}

${subject} FANI BO'YICHA BAHOLASH MEZONLARI:
${subjectRules}

VAZIFANG:
1. O'quvchining javob rasmini ETALON bilan solishtir
2. 0 dan 10 gacha baho ber (kasr mumkin, masalan 7.5)
3. O'zbek tilida batafsil izoh yoz:
   - Nimasi to'g'ri bajarilgan
   - Qanday xatolar bor (har bir xatoni aniq ko'rsat)
   - Qanday yaxshilash mumkin (konstruktiv maslahat)
4. Agar rasm vazifaga TEGISHLI EMAS bo'lsa — "is_relevant": false qaytar

MUHIM QOIDALAR:
- Faqat qo'l yozuvi (pen/pencil) ni o'quvchi javobi sifatida qabul qil
- Bosma matn (kitobdagi) ni o'quvchi javobi deb hisoblaMA
- Agar qo'l yozuvi umuman yo'q bo'lsa — baho 0
- Adolatli, lekin rag'batlantiruvchi bo'l
- Xatolarni aniq ko'rsat, lekin o'quvchini qo'llab-quvvatla

JAVOB FORMATI (faqat JSON):
{
  "is_relevant": true,
  "score": 8.5,
  "comment": "O'zbek tilida batafsil izoh...",
  "mistakes": [
    {"description": "xato tavsifi", "correction": "to'g'ri varianti"}
  ],
  "strengths": ["yaxshi tomonlari"],
  "suggestions": ["tavsiyalar"]
}`
}

function buildRelevancePrompt(taskContext: string): string {
  return `Quyidagi vazifa konteksti berilgan:

VAZIFA KONTEKSTI:
${taskContext}

O'quvchi rasm yubordi. Sen aniqlashing kerak:
- Bu rasm yuqoridagi VAZIFAGA tegishlimi yoki boshqa narsami?
- Agar tegishli bo'lsa "is_relevant": true
- Agar boshqa vazifa yoki umuman tegishli bo'lmasa "is_relevant": false va sababini yoz

JAVOB FORMATI (faqat JSON):
{
  "is_relevant": true/false,
  "reason": "sababi..."
}`
}

export interface TaskAnalysis {
  topic: string
  task_type: string
  context: string
}

export interface GradeResult {
  is_relevant: boolean
  score: number
  comment: string
  mistakes: Array<{description: string; correction: string}>
  strengths: string[]
  suggestions: string[]
}

export interface RelevanceCheck {
  is_relevant: boolean
  reason: string
}

export async function analyzeTaskImage(base64Image: string, subject: string): Promise<TaskAnalysis> {
  const maxRetries = 3

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      logger.info('Analyzing task image with OpenAI', {subject, attempt: attempt + 1})

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {role: 'system', content: buildAnalyzePrompt(subject)},
          {
            role: 'user',
            content: [
              {type: 'text', text: `Bu ${subject} fanidan vazifa rasmi. Tahlil qilib, JSON formatda javob ber.`},
              {type: 'image_url', image_url: {url: `data:image/jpeg;base64,${base64Image}`, detail: 'high'}},
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.2,
        response_format: {type: 'json_object'},
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('Empty response from OpenAI')

      const parsed = JSON.parse(content) as TaskAnalysis
      logger.info('Task analysis completed', {topic: parsed.topic, task_type: parsed.task_type})
      return parsed
    } catch (error) {
      logger.error('OpenAI analyzeTaskImage error', {error, attempt})
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000))
        continue
      }
      throw error
    }
  }

  throw new Error('Failed to analyze task image after retries')
}

export async function gradeStudentAnswer(
  answerBase64: string,
  taskContext: string,
  subject: string,
): Promise<GradeResult> {
  const maxRetries = 3

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      logger.info('Grading student answer with OpenAI', {subject, attempt: attempt + 1})

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {role: 'system', content: buildGradePrompt(subject, taskContext)},
          {
            role: 'user',
            content: [
              {type: 'text', text: `Bu o'quvchining javob rasmi. Baholab, JSON formatda natija ber.`},
              {type: 'image_url', image_url: {url: `data:image/jpeg;base64,${answerBase64}`, detail: 'high'}},
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.3,
        response_format: {type: 'json_object'},
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('Empty response from OpenAI')

      const parsed = JSON.parse(content) as GradeResult
      logger.info('Student grading completed', {score: parsed.score, is_relevant: parsed.is_relevant})
      return parsed
    } catch (error) {
      logger.error('OpenAI gradeStudentAnswer error', {error, attempt})
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000))
        continue
      }
      throw error
    }
  }

  throw new Error('Failed to grade student answer after retries')
}

export async function isRelevantAnswer(answerBase64: string, taskContext: string): Promise<RelevanceCheck> {
  try {
    logger.info('Checking answer relevance with OpenAI')

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {role: 'system', content: buildRelevancePrompt(taskContext)},
        {
          role: 'user',
          content: [
            {type: 'text', text: `Bu o'quvchi yuborgan rasm. Vazifaga tegishlimi?`},
            {type: 'image_url', image_url: {url: `data:image/jpeg;base64,${answerBase64}`, detail: 'low'}},
          ],
        },
      ],
      max_tokens: 512,
      temperature: 0.1,
      response_format: {type: 'json_object'},
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Empty response from OpenAI')

    return JSON.parse(content) as RelevanceCheck
  } catch (error) {
    logger.error('OpenAI relevance check error', {error})
    return {is_relevant: true, reason: 'Tekshirib bo\'lmadi, qabul qilinmoqda'}
  }
}
