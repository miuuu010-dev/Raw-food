export interface Ingredient {
  id: string;
  name: string;
  category: 'grain' | 'vegetable' | 'mushroom_seaweed' | 'fruit_seed';
  categoryLabel: string;
  origin: string;
  description: string;
}

export interface TargetPerson {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  points: string[];
}

export interface HowToStep {
  step: number;
  title: string;
  action: string;
  tip: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const PRODUCT_INFO = {
  id: 'haru-saengsik-50',
  name: '하루생식 50곡 순수 한끼',
  badge: '100% 국내산 원료',
  originalPrice: 48000,
  price: 39000,
  discountRate: 18,
  volume: '30g x 30포 (총 900g / 1개월분)',
  deliveryFee: 0,
  deliveryText: '전국 무료배송 (우체국 택배)',
  gift: '전용 친환경 에코 트라이탄 보틀(350ml) 증정',
  summary: '엄선된 국내산 50가지 통곡물과 채소를 자연 그대로 동결건조하여 담았습니다. 물이나 우유에 흔들어 마시면 바쁜 일상 속 가볍고 든든한 식사가 됩니다.',
  features: [
    '국내산 50가지 자연 통곡물 & 신선 채소',
    '동결건조 공법으로 자연 본연의 맛 유지',
    '합성향료 · 색소 · 보존료 무첨가',
    '이지컷 1포 개별 스틱으로 간편 휴대',
  ],
};

export const TARGET_AUDIENCE: TargetPerson[] = [
  {
    id: 'target-morning',
    number: '01',
    title: '아침 식사를 거르는 분',
    subtitle: '출근길·등굣길, 1분이면 끝나는 든든한 시작',
    points: [
      '아침에 밥 차릴 시간조차 부족해 빈속으로 나서시는 분',
      '부담스럽지 않으면서도 속을 차분하게 채우고 싶은 분',
      '물이나 우유에 바로 섞어 이동 중에도 간편하게 마실 수 있습니다',
    ],
  },
  {
    id: 'target-busy',
    number: '02',
    title: '끼니 챙기기 번거로운 분',
    subtitle: '조리와 설거지 없이 깔끔하게 한 끼 해결',
    points: [
      '혼자 살아 매끼 요리하고 치우는 과정이 번거로운 분',
      '배달음식이나 인스턴트에 지쳐 담백한 음식을 찾는 분',
      '개별 포장 스틱 1포로 컵과 보틀만 있으면 언제 어디서나 해결됩니다',
    ],
  },
  {
    id: 'target-natural',
    number: '03',
    title: '자연 그대로의 곡물 맛을 찾는 분',
    subtitle: '달지 않고 고소한 통곡물 본연의 깊은 풍미',
    points: [
      '인공 감미료의 자극적인 단맛 대신 정직한 맛을 원하시는 분',
      '다양한 통곡물과 채소를 매일 골고루 챙겨 먹기 어려웠던 분',
      '동결건조하여 자연의 고소함을 그대로 느낄 수 있습니다',
    ],
  },
];

export const HOW_TO_STEPS: HowToStep[] = [
  {
    step: 1,
    title: '물 또는 우유 200ml 준비',
    action: '보틀이나 컵에 물, 우유, 혹은 두유를 먼저 붓습니다.',
    tip: '액체를 먼저 넣어야 가루가 바닥에 뭉치지 않고 부드럽게 잘 풀립니다.',
  },
  {
    step: 2,
    title: '하루생식 1포(30g) 넣기',
    action: '이지컷 스틱을 가볍게 뜯어 액체 위에 붓습니다.',
    tip: '한 포씩 위생적으로 낱개 포장되어 있어 어디서든 간편하게 뜯을 수 있습니다.',
  },
  {
    step: 3,
    title: '가볍게 흔들어 마시기',
    action: '뚜껑을 닫고 5~10초간 위아래로 흔들어 바로 드세요.',
    tip: '생식 특성상 시간이 지나면 걸쭉해질 수 있으니 섞은 직후 바로 드시면 가장 맛있습니다.',
  },
];

export const DRINK_COMBINATIONS = [
  {
    id: 'water',
    name: '시원한 물 (200ml)',
    tag: '깔끔하고 담백함',
    desc: '곡물 본연의 구수함과 채소의 맑은 맛을 산뜻하게 즐길 수 있습니다.',
  },
  {
    id: 'milk',
    name: '신선한 우유 (200ml)',
    tag: '부드럽고 고소함',
    desc: '우유의 부드러움이 더해져 미숫가루나 라떼처럼 더 풍성하고 묵직한 포만감을 줍니다.',
  },
  {
    id: 'soymilk',
    name: '고소한 두유 (200ml)',
    tag: '진하고 든든함',
    desc: '콩의 고소함과 50가지 통곡물이 어우러져 깊은 풍미를 자랑합니다.',
  },
];

export const INGREDIENTS_50: Ingredient[] = [
  // 1. 통곡물 & 두류 (18종)
  { id: 'g1', name: '현미', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '도정하지 않은 통곡물의 고소함' },
  { id: 'g2', name: '발아현미', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '자연 싹을 틔운 부드러운 곡물' },
  { id: 'g3', name: '흑미', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '깊고 짙은 풍미의 검은 쌀' },
  { id: 'g4', name: '찹쌀', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '부드럽고 찰진 식감' },
  { id: 'g5', name: '늘보리', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '풍부한 식이섬유를 지닌 곡물' },
  { id: 'g6', name: '귀리(오트)', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '담백하고 든든한 슈퍼 그레인' },
  { id: 'g7', name: '수수', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '예로부터 즐겨온 붉은 잡곡' },
  { id: 'g8', name: '찰기장', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '노란빛의 작은 영양 알곡' },
  { id: 'g9', name: '조', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '가볍고 구수한 전통 잡곡' },
  { id: 'g10', name: '율무', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '고소한 풍미의 대표 주자' },
  { id: 'g11', name: '메밀', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '산뜻하고 개운한 메밀 가루' },
  { id: 'g12', name: '백태(대두)', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '진하고 깊은 고소함' },
  { id: 'g13', name: '서리태(검정콩)', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '속이 파란 전통 검정콩' },
  { id: 'g14', name: '쥐눈이콩(약콩)', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '작지만 실한 우리 콩' },
  { id: 'g15', name: '팥', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '은은한 단맛과 담백함' },
  { id: 'g16', name: '녹두', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '깔끔하고 시원한 곡물' },
  { id: 'g17', name: '차조', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '찰기 있는 전통 오곡' },
  { id: 'g18', name: '통밀', category: 'grain', categoryLabel: '통곡물류', origin: '국내산', description: '껍질째 빻은 밀알의 정직함' },

  // 2. 녹황색 채소 & 근채류 (16종)
  { id: 'v1', name: '케일', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '녹색 잎채소의 싱그러움' },
  { id: 'v2', name: '신선초', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '특유의 향긋한 잎채소' },
  { id: 'v3', name: '시금치', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '부드럽고 짙푸른 녹황색 채소' },
  { id: 'v4', name: '양배추', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '아삭하고 속 편안한 배추' },
  { id: 'v5', name: '브로콜리', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '싱싱한 녹색 송이 채소' },
  { id: 'v6', name: '당근', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '주황빛 자연의 달콤함' },
  { id: 'v7', name: '단호박', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '부드럽고 은은한 풍미' },
  { id: 'v8', name: '우엉', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '흙의 기운을 담은 뿌리채소' },
  { id: 'v9', name: '연근', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '아삭하고 담백한 연뿌리' },
  { id: 'v10', name: '무', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '시원하고 맑은 수분감' },
  { id: 'v11', name: '무청(시래기)', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '정성스레 말린 밭의 채소' },
  { id: 'v12', name: '비트', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '붉고 고운 뿌리채소' },
  { id: 'v13', name: '미나리', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '상쾌하고 풋풋한 향' },
  { id: 'v14', name: '쑥', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '봄철 들녘의 그윽한 향' },
  { id: 'v15', name: '더덕', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '산에서 자란 알찬 뿌리' },
  { id: 'v16', name: '생강', category: 'vegetable', categoryLabel: '채소류', origin: '국내산', description: '개운함을 돕는 약간의 생강' },

  // 3. 버섯 & 해조류 (8종)
  { id: 'm1', name: '표고버섯', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '자연 건조한 깊은 버섯 향' },
  { id: 'm2', name: '느타리버섯', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '부드럽고 쫄깃한 식용 버섯' },
  { id: 'm3', name: '영지버섯', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '자연산 건영지 추출 가루' },
  { id: 'm4', name: '다시마', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '바다의 미네랄과 감칠맛' },
  { id: 'm5', name: '미역', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '청정 남해안의 푸른 미역' },
  { id: 'm6', name: '김', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '바삭하고 향긋한 전통 김' },
  { id: 'm7', name: '파래', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '바다 내음 가득한 해조류' },
  { id: 'm8', name: '톳', category: 'mushroom_seaweed', categoryLabel: '버섯·해조류', origin: '국내산', description: '오독오독 청정 해조' },

  // 4. 과일 & 씨앗류 (8종)
  { id: 'f1', name: '사과', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '은은하고 산뜻한 과실의 맛' },
  { id: 'f2', name: '배', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '시원하고 달큼한 나주 배' },
  { id: 'f3', name: '감', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '달콤하게 익은 가을 감' },
  { id: 'f4', name: '대추', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '풍미를 더하는 보은 대추' },
  { id: 'f5', name: '참깨', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '고소한 향기의 볶음 참깨' },
  { id: 'f6', name: '들깨', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '진하고 묵직한 한국 들깨' },
  { id: 'f7', name: '잣', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '가평 잣의 고급스러운 고소함' },
  { id: 'f8', name: '호두', category: 'fruit_seed', categoryLabel: '과일·씨앗류', origin: '국내산', description: '신선하고 고소한 국산 호두' },
];

export const FAQS: FaqItem[] = [
  {
    question: '생식은 선식이나 미숫가루와 무엇이 다른가요?',
    answer: '선식이나 미숫가루는 곡물을 볶거나 쪄서 가루로 낸 것이며, 생식(生食)은 열을 가하지 않고 영하 40도 이하에서 동결건조하여 원료 본연의 영양과 고유의 맛을 그대로 보존한 순수 가공 식품입니다.',
  },
  {
    question: '뜨거운 물에 타서 마셔도 되나요?',
    answer: '열에 약한 원료 본연의 특성을 지키기 위해 미지근한 물이나 시원한 물, 찬 우유에 타서 드시는 것을 권장합니다. 너무 뜨거운 물은 가루가 뭉칠 수 있습니다.',
  },
  {
    question: '하루에 몇 번, 언제 마시는 것이 좋은가요?',
    answer: '일반 식품이므로 정해진 시간은 없습니다. 식사를 거르기 쉬운 아침 식사 대용으로 가장 많이 드시며, 가벼운 저녁이나 나른한 오후 간식으로 하루 1~2포 편안하게 즐기실 수 있습니다.',
  },
  {
    question: '보관은 어떻게 해야 하나요?',
    answer: '개별 스틱 포장으로 밀봉되어 있으므로 직사광선과 고온다습한 곳을 피해 서늘한 실온 또는 냉장 보관하시면 좋습니다. 개봉 후에는 즉시 타서 드세요.',
  },
  {
    question: '단맛이나 첨가물이 들어있나요?',
    answer: '인공 설탕, 합성 착색료, 합성 보존료, 착향료를 전혀 넣지 않았습니다. 50가지 순수 곡물과 채소, 과일 고유의 자연스러운 맛과 고소함만 담았습니다.',
  },
];
