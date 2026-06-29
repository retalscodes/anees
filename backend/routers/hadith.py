from fastapi import APIRouter
import random

router = APIRouter()

# All hadiths from the Six Books (Kutub al-Sittah) or authenticated collections.
# Grades noted where not Bukhari/Muslim.
HADITHS = [
    {"text": "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى", "translation": "Actions are judged by intentions, and every person will get what they intended.", "source": "البخاري ومسلم", "narrator": "عمر بن الخطاب رضي الله عنه"},
    {"text": "المسلم من سلم المسلمون من لسانه ويده", "translation": "A Muslim is the one from whose tongue and hand other Muslims are safe.", "source": "البخاري ومسلم", "narrator": "عبدالله بن عمرو رضي الله عنه"},
    {"text": "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه", "translation": "None of you truly believes until he loves for his brother what he loves for himself.", "source": "البخاري ومسلم", "narrator": "أنس بن مالك رضي الله عنه"},
    {"text": "من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت", "translation": "Whoever believes in Allah and the Last Day, let him say what is good or remain silent.", "source": "البخاري ومسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "إن الله رفيق يحب الرفق في الأمر كله", "translation": "Indeed Allah is gentle and loves gentleness in all matters.", "source": "البخاري ومسلم", "narrator": "عائشة رضي الله عنها"},
    {"text": "أحب الأعمال إلى الله أدومها وإن قل", "translation": "The most beloved of deeds to Allah are those done consistently, even if they are small.", "source": "البخاري ومسلم", "narrator": "عائشة رضي الله عنها"},
    {"text": "كل معروف صدقة", "translation": "Every act of kindness is charity.", "source": "البخاري ومسلم", "narrator": "جابر بن عبدالله رضي الله عنه"},
    {"text": "ليس الغنى عن كثرة العرض، ولكن الغنى غنى النفس", "translation": "Richness is not having many possessions, but true richness is the richness of the soul.", "source": "البخاري ومسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "يسِّروا ولا تعسِّروا، وبشِّروا ولا تنفِّروا", "translation": "Make things easy and do not make them difficult; give glad tidings and do not drive people away.", "source": "البخاري ومسلم", "narrator": "أنس بن مالك رضي الله عنه"},
    {"text": "إن الله جميل يحب الجمال", "translation": "Indeed Allah is beautiful and He loves beauty.", "source": "مسلم", "narrator": "عبدالله بن مسعود رضي الله عنه"},
    {"text": "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير", "translation": "The strong believer is better and more beloved to Allah than the weak believer, though there is good in both.", "source": "مسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "ما نقصت صدقة من مال", "translation": "Charity does not decrease wealth.", "source": "مسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "الصلوات الخمس والجمعة إلى الجمعة كفارات لما بينهن", "translation": "The five prayers and Friday to Friday are expiation for what is between them.", "source": "مسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "البر حسن الخلق", "translation": "Righteousness is good character.", "source": "مسلم", "narrator": "النواس بن سمعان رضي الله عنه"},
    {"text": "الطهور شطر الإيمان", "translation": "Cleanliness is half of faith.", "source": "مسلم", "narrator": "أبو مالك الأشعري رضي الله عنه"},
    {"text": "خيركم من تعلم القرآن وعلمه", "translation": "The best of you are those who learn the Quran and teach it.", "source": "البخاري", "narrator": "عثمان بن عفان رضي الله عنه"},
    {"text": "الدين النصيحة", "translation": "Religion is sincerity (sincere well-wishing).", "source": "مسلم", "narrator": "تميم الداري رضي الله عنه"},
    {"text": "من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة", "translation": "Whoever relieves a believer of a hardship in this world, Allah will relieve him of a hardship on the Day of Judgment.", "source": "مسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "خير الصدقة أن تصدق وأنت صحيح شحيح", "translation": "The best charity is to give when you are in good health and in need of the money yourself.", "source": "البخاري ومسلم", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "من أحب لقاء الله أحب الله لقاءه", "translation": "Whoever loves to meet Allah, Allah loves to meet him.", "source": "البخاري ومسلم", "narrator": "عبادة بن الصامت رضي الله عنه"},
    {"text": "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن", "translation": "Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.", "source": "الترمذي — حسن صحيح", "narrator": "معاذ بن جبل رضي الله عنه"},
    {"text": "تبسمك في وجه أخيك صدقة", "translation": "Your smile in your brother's face is charity.", "source": "الترمذي — صحيح", "narrator": "أبو ذر الغفاري رضي الله عنه"},
    {"text": "إن الله يحب إذا عمل أحدكم عملًا أن يتقنه", "translation": "Indeed Allah loves that when one of you does a deed, he does it with excellence.", "source": "البيهقي — صحيح الجامع", "narrator": "عائشة رضي الله عنها"},
    {"text": "الراحمون يرحمهم الرحمن، ارحموا من في الأرض يرحمكم من في السماء", "translation": "The merciful are shown mercy by the Most Merciful. Show mercy to those on earth, and He Who is above will show mercy to you.", "source": "أبو داود والترمذي — صحيح", "narrator": "عبدالله بن عمرو رضي الله عنه"},
    {"text": "من حسن إسلام المرء تركه ما لا يعنيه", "translation": "Among the excellence of a person's Islam is leaving what does not concern him.", "source": "الترمذي وابن ماجه — حسن", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "من صمت نجا", "translation": "Whoever remains silent is saved.", "source": "الترمذي — صحيح", "narrator": "عبدالله بن عمرو رضي الله عنه"},
    {"text": "إن مما أدرك الناس من كلام النبوة الأولى: إذا لم تستحِ فاصنع ما شئت", "translation": "Among what people have preserved from the earlier prophetic teachings: if you have no shame, do as you wish.", "source": "البخاري", "narrator": "أبو مسعود الأنصاري رضي الله عنه"},
    {"text": "إن أكمل المؤمنين إيمانًا أحسنهم خلقًا", "translation": "The most complete of believers in faith are those with the best character.", "source": "أبو داود والترمذي — صحيح", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "لن تؤمنوا حتى تراحموا، قالوا: كلنا رحيم. قال: إنه ليس رحمة أحدكم صاحبه، ولكنها رحمة العامة", "translation": "You will not believe until you are merciful. They said: We are all merciful. He said: It is not the mercy one has for his companion, but mercy for all people.", "source": "الطبراني — صحيح الجامع", "narrator": "جرير بن عبدالله رضي الله عنه"},
    {"text": "عجبًا لأمر المؤمن، إن أمره كله له خير، وليس ذلك لأحد إلا للمؤمن: إن أصابته سراء شكر فكان خيرًا له، وإن أصابته ضراء صبر فكان خيرًا له", "translation": "Amazing is the affair of the believer — all of it is good, and that is only for the believer. If good reaches him he is thankful, and if hardship befalls him he is patient — both are good for him.", "source": "مسلم", "narrator": "صهيب الرومي رضي الله عنه"},
]


@router.get("/random")
async def random_hadith():
    return random.choice(HADITHS)
