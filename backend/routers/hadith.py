from fastapi import APIRouter
import random

router = APIRouter()

HADITHS = [
    {"text": "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى", "translation": "Actions are judged by intentions, and every person will get what they intended.", "source": "Bukhari & Muslim", "narrator": "عمر بن الخطاب رضي الله عنه"},
    {"text": "المسلم من سلم المسلمون من لسانه ويده", "translation": "A Muslim is the one from whose tongue and hand other Muslims are safe.", "source": "Bukhari", "narrator": "عبدالله بن عمرو رضي الله عنه"},
    {"text": "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه", "translation": "None of you truly believes until he loves for his brother what he loves for himself.", "source": "Bukhari & Muslim", "narrator": "أنس بن مالك رضي الله عنه"},
    {"text": "الطهور شطر الإيمان", "translation": "Cleanliness is half of faith.", "source": "Muslim", "narrator": "أبو مالك الأشعري رضي الله عنه"},
    {"text": "خيركم من تعلم القرآن وعلمه", "translation": "The best of you are those who learn the Quran and teach it.", "source": "Bukhari", "narrator": "عثمان بن عفان رضي الله عنه"},
    {"text": "الدين النصيحة", "translation": "Religion is sincerity (good advice/well-wishing).", "source": "Muslim", "narrator": "تميم الداري رضي الله عنه"},
    {"text": "من صمت نجا", "translation": "Whoever remains silent is saved.", "source": "Tirmidhi", "narrator": "عبدالله بن عمرو رضي الله عنه"},
    {"text": "ابتغوا الرفعة عند الله قيل وما هي يا رسول الله؟ قال: تصل من قطعك، وتعطي من حرمك، وتعفو عمن ظلمك", "translation": "Seek high status with Allah. They asked: What is it, O Messenger of Allah? He said: Connect with those who cut you off, give to those who deprive you, and forgive those who wrong you.", "source": "Al-Hakim", "narrator": "عقبة بن عامر رضي الله عنه"},
    {"text": "تبسمك في وجه أخيك صدقة", "translation": "Your smile in your brother's face is charity.", "source": "Tirmidhi", "narrator": "أبو ذر الغفاري رضي الله عنه"},
    {"text": "إن الله يحب إذا عمل أحدكم عملا أن يتقنه", "translation": "Indeed Allah loves that when one of you does a deed, he does it with excellence.", "source": "Al-Bayhaqi", "narrator": "عائشة رضي الله عنها"},
    {"text": "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت", "translation": "Whoever believes in Allah and the Last Day, let him say what is good or remain silent.", "source": "Bukhari & Muslim", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "البر حسن الخلق", "translation": "Righteousness is good character.", "source": "Muslim", "narrator": "النواس بن سمعان رضي الله عنه"},
    {"text": "إن الله رفيق يحب الرفق في الأمر كله", "translation": "Indeed Allah is gentle and loves gentleness in all matters.", "source": "Bukhari & Muslim", "narrator": "عائشة رضي الله عنها"},
    {"text": "من أحب لقاء الله أحب الله لقاءه", "translation": "Whoever loves to meet Allah, Allah loves to meet him.", "source": "Bukhari & Muslim", "narrator": "عبادة بن الصامت رضي الله عنه"},
    {"text": "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن", "translation": "Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.", "source": "Tirmidhi", "narrator": "معاذ بن جبل رضي الله عنه"},
    {"text": "أحب الأعمال إلى الله أدومها وإن قل", "translation": "The most beloved of deeds to Allah are those done consistently, even if they are small.", "source": "Bukhari & Muslim", "narrator": "عائشة رضي الله عنها"},
    {"text": "من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة", "translation": "Whoever relieves a believer of a hardship in this world, Allah will relieve him of a hardship on the Day of Judgment.", "source": "Muslim", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "الصلوات الخمس والجمعة إلى الجمعة كفارة لما بينهن", "translation": "The five prayers and Friday to Friday are expiation for what is between them.", "source": "Muslim", "narrator": "أبو هريرة رضي الله عنه"},
    {"text": "كل معروف صدقة", "translation": "Every act of kindness is charity.", "source": "Bukhari & Muslim", "narrator": "جابر بن عبدالله رضي الله عنه"},
    {"text": "ليس الغنى عن كثرة العرض ولكن الغنى غنى النفس", "translation": "Richness is not having many possessions, but true richness is the richness of the soul.", "source": "Bukhari & Muslim", "narrator": "أبو هريرة رضي الله عنه"},
]


@router.get("/random")
async def random_hadith():
    return random.choice(HADITHS)
