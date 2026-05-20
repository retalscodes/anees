const DUAS = [
  {
    category: "الاستيقاظ من النوم",
    categoryEn: "Waking Up",
    icon: "🌅",
    items: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
        source: "البخاري"
      }
    ]
  },
  {
    category: "دخول الخلاء",
    categoryEn: "Entering Bathroom",
    icon: "🚿",
    items: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        translation: "O Allah, I seek refuge with You from all evil and evil-doers.",
        source: "البخاري، مسلم"
      }
    ]
  },
  {
    category: "الخروج من الخلاء",
    categoryEn: "Leaving Bathroom",
    icon: "✅",
    items: [
      {
        arabic: "غُفْرَانَكَ",
        translation: "I seek Your forgiveness.",
        source: "أبو داود، الترمذي"
      }
    ]
  },
  {
    category: "قبل الأكل",
    categoryEn: "Before Eating",
    icon: "🍽️",
    items: [
      {
        arabic: "بِسْمِ اللَّهِ",
        translation: "In the name of Allah.",
        source: "أبو داود"
      },
      {
        arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
        translation: "In the name of Allah and with the blessings of Allah.",
        source: "أبو داود"
      }
    ]
  },
  {
    category: "بعد الأكل",
    categoryEn: "After Eating",
    icon: "🤲",
    items: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
        source: "أبو داود، الترمذي"
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا",
        translation: "Praise be to Allah, abundant, good and blessed praise. Praise that is never enough, that we cannot do without, O our Lord.",
        source: "البخاري"
      }
    ]
  },
  {
    category: "دخول المنزل",
    categoryEn: "Entering Home",
    icon: "🏠",
    items: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
        translation: "O Allah, I ask You for the good of entering and the good of leaving. In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we rely.",
        source: "أبو داود"
      }
    ]
  },
  {
    category: "الخروج من المنزل",
    categoryEn: "Leaving Home",
    icon: "🚪",
    items: [
      {
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        translation: "In the name of Allah, I place my trust in Allah. There is no power and no strength except with Allah.",
        source: "أبو داود، الترمذي"
      }
    ]
  },
  {
    category: "الذهاب إلى المسجد",
    categoryEn: "Going to Mosque",
    icon: "🕌",
    items: [
      {
        arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَاجْعَلْ فِي سَمْعِي نُورًا، وَاجْعَلْ فِي بَصَرِي نُورًا، وَاجْعَلْ مِنْ خَلْفِي نُورًا، وَمِنْ أَمَامِي نُورًا",
        translation: "O Allah, place light in my heart, light on my tongue, light in my hearing, light in my sight, light behind me and light in front of me.",
        source: "البخاري، مسلم"
      }
    ]
  },
  {
    category: "ركوب المركبة",
    categoryEn: "Riding a Vehicle",
    icon: "🚗",
    items: [
      {
        arabic: "بِسْمِ اللَّهِ، الْحَمْدُ لِلَّهِ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        translation: "In the name of Allah. Praise be to Allah. Glory be to the One who has made this subservient to us, and we were not capable of that, and surely to our Lord we are returning.",
        source: "أبو داود، الترمذي"
      }
    ]
  },
  {
    category: "الهم والحزن",
    categoryEn: "Anxiety & Distress",
    icon: "💙",
    items: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        translation: "O Allah, I seek refuge with You from worry and grief, from incapacity and laziness, from miserliness and cowardice, from being heavily in debt and from being overpowered by men.",
        source: "البخاري"
      },
      {
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        translation: "There is no god but Allah, the Mighty, the Forbearing. There is no god but Allah, the Lord of the Mighty Throne. There is no god but Allah, the Lord of the heavens and the Lord of the earth and the Lord of the Noble Throne.",
        source: "البخاري، مسلم"
      }
    ]
  },
  {
    category: "الدعاء للمريض",
    categoryEn: "For the Sick",
    icon: "🤒",
    items: [
      {
        arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
        translation: "O Allah, Lord of mankind, remove the harm and heal, You are the Healer, there is no healing except Your healing, a healing that leaves no illness.",
        source: "البخاري، مسلم"
      }
    ]
  },
  {
    category: "عند سماع المؤذن",
    categoryEn: "Hearing the Adhan",
    icon: "📢",
    items: [
      {
        arabic: "وَأَنَا أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، رَضِيتُ بِاللَّهِ رَبًّا وَبِمُحَمَّدٍ رَسُولًا وَبِالْإِسْلَامِ دِينًا",
        translation: "I bear witness that there is no god but Allah alone, without partner, and that Muhammad is His servant and messenger. I am pleased with Allah as Lord, Muhammad as Messenger, and Islam as religion.",
        source: "مسلم"
      }
    ]
  }
];
