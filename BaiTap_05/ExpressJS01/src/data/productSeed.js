const productSeed = [
    {
        name: 'KeyViet GK87 Pro RGB',
        price: 2290000,
        category: 'gaming',
        images: [
            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 18,
        sold: 74,
        views: 3250,
        isPromotion: true
    },
    {
        name: 'KeyViet NK65 Wireless',
        price: 2890000,
        category: 'wireless',
        images: [
            'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 10,
        sold: 51,
        views: 2150,
        isPromotion: false
    },
    {
        name: 'KeyViet Office TKL Silent',
        price: 1690000,
        category: 'office',
        images: [
            'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 22,
        sold: 63,
        views: 2890,
        isPromotion: true
    },
    {
        name: 'KeyViet Custom 75 Barebone',
        price: 1990000,
        category: 'custom',
        images: [
            'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 8,
        sold: 34,
        views: 1640,
        isPromotion: false
    },
    {
        name: 'Aether 68 Hall Effect',
        price: 3590000,
        category: 'gaming',
        images: [
            'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 6,
        sold: 47,
        views: 2450,
        isPromotion: false
    },
    {
        name: 'Nova Air 75 Tri-Mode',
        price: 3190000,
        category: 'wireless',
        images: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 12,
        sold: 41,
        views: 3100,
        isPromotion: true
    },
    {
        name: 'WorkFlow 98 Fullsize',
        price: 1890000,
        category: 'office',
        images: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 16,
        sold: 27,
        views: 1850,
        isPromotion: false
    },
    {
        name: 'Forge 60 DIY Kit',
        price: 1490000,
        category: 'custom',
        images: [
            'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 19,
        sold: 58,
        views: 2620,
        isPromotion: true
    },
    {
        name: 'Phantom 75 Low Latency',
        price: 2690000,
        category: 'gaming',
        images: [
            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 11,
        sold: 66,
        views: 3420,
        isPromotion: true
    },
    {
        name: 'Cloud 65 Bluetooth',
        price: 2390000,
        category: 'wireless',
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 9,
        sold: 39,
        views: 2100,
        isPromotion: false
    },
    {
        name: 'DeskPro 84 Hot-Swap',
        price: 1790000,
        category: 'office',
        images: [
            'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 25,
        sold: 72,
        views: 3550,
        isPromotion: true
    },
    {
        name: 'AluCraft 65 CNC',
        price: 3290000,
        category: 'custom',
        images: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 7,
        sold: 29,
        views: 1750,
        isPromotion: false
    },
    {
        name: 'RapidFire 80 HE',
        price: 3790000,
        category: 'gaming',
        images: [
            'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 5,
        sold: 33,
        views: 2380,
        isPromotion: false
    },
    {
        name: 'Breeze 75 Ultra Thin',
        price: 2090000,
        category: 'wireless',
        images: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 14,
        sold: 44,
        views: 2750,
        isPromotion: true
    },
    {
        name: 'OfficeFlow 87 Tactile',
        price: 1590000,
        category: 'office',
        images: [
            'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 21,
        sold: 53,
        views: 2300,
        isPromotion: false
    },
    {
        name: 'ModLab 70 Polycarbonate',
        price: 2590000,
        category: 'custom',
        images: [
            'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 13,
        sold: 31,
        views: 1920,
        isPromotion: true
    },
    {
        name: 'Titan 96 Pro',
        price: 2990000,
        category: 'gaming',
        images: [
            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 4,
        sold: 89,
        views: 4100,
        isPromotion: true
    },
    {
        name: 'Echo 68 Pocket Wireless',
        price: 1990000,
        category: 'wireless',
        images: [
            'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 17,
        sold: 26,
        views: 1580,
        isPromotion: false
    },
    {
        name: 'QuietType 100 Fullsize',
        price: 1790000,
        category: 'office',
        images: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 20,
        sold: 38,
        views: 2210,
        isPromotion: true
    },
    {
        name: 'CraftOne Alice Layout',
        price: 3490000,
        category: 'custom',
        images: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 3,
        sold: 14,
        views: 980,
        isPromotion: false
    },
    {
        name: 'Spectra 75 RGB Max',
        price: 2790000,
        category: 'gaming',
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 12,
        sold: 77,
        views: 3680,
        isPromotion: true
    },
    {
        name: 'Nomad 61 Compact Wireless',
        price: 2190000,
        category: 'wireless',
        images: [
            'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 15,
        sold: 36,
        views: 2050,
        isPromotion: false
    },
    {
        name: 'Focus 87 Brown Switch',
        price: 1690000,
        category: 'office',
        images: [
            'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 23,
        sold: 49,
        views: 2480,
        isPromotion: true
    },
    {
        name: 'FrameX 75 Custom Pro',
        price: 3090000,
        category: 'custom',
        images: [
            'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80'
        ],
        stock: 9,
        sold: 22,
        views: 1420,
        isPromotion: false
    }
];

module.exports = productSeed;

