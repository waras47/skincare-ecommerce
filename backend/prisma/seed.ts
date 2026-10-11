import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@skincare.test" },
    update: {},
    create: { name: "Admin", email: "admin@skincare.test", passwordHash: adminPasswordHash, role: "admin" },
  });

  await prisma.user.upsert({
    where: { email: "dinda@skincare.test" },
    update: {},
    create: { name: "Dinda", email: "dinda@skincare.test", passwordHash: customerPasswordHash, role: "customer" },
  });

  const cleansing = await prisma.category.upsert({
    where: { slug: "cleansing" },
    update: {},
    create: { name: "Cleansing", slug: "cleansing" },
  });
  const moisturizer = await prisma.category.upsert({
    where: { slug: "moisturizer" },
    update: {},
    create: { name: "Moisturizer", slug: "moisturizer" },
  });
  const serum = await prisma.category.upsert({
    where: { slug: "serum" },
    update: {},
    create: { name: "Serum", slug: "serum" },
  });

  const products = [
    {
      categoryId: cleansing.id,
      name: "Gentle Foaming Cleanser",
      slug: "gentle-foaming-cleanser",
      description: "Pembersih wajah berbusa lembut untuk kulit sehari-hari.",
      ingredients: "Aqua, Cocamidopropyl Betaine, Glycerin",
      skinTypes: ["normal", "kering", "sensitif"],
      basePrice: 85000,
      variants: [{ variantName: "100ml", sku: "GFC-100", price: 85000, stock: 50 }],
    },
    {
      categoryId: cleansing.id,
      name: "Oil Control Clay Cleanser",
      slug: "oil-control-clay-cleanser",
      description: "Pembersih berbasis clay untuk kulit berminyak dan berjerawat.",
      ingredients: "Aqua, Kaolin, Salicylic Acid",
      skinTypes: ["berminyak", "kombinasi"],
      basePrice: 95000,
      variants: [{ variantName: "100ml", sku: "OCC-100", price: 95000, stock: 40 }],
    },
    {
      categoryId: moisturizer.id,
      name: "Hydra Barrier Moisturizer",
      slug: "hydra-barrier-moisturizer",
      description: "Pelembap intensif untuk menjaga skin barrier kulit kering.",
      ingredients: "Aqua, Ceramide NP, Hyaluronic Acid",
      skinTypes: ["kering", "sensitif"],
      basePrice: 150000,
      variants: [
        { variantName: "30ml", sku: "HBM-30", price: 150000, stock: 30 },
        { variantName: "50ml", sku: "HBM-50", price: 220000, stock: 20 },
      ],
    },
    {
      categoryId: moisturizer.id,
      name: "Oil-Free Gel Moisturizer",
      slug: "oil-free-gel-moisturizer",
      description: "Pelembap gel ringan non-komedogenik untuk kulit berminyak.",
      ingredients: "Aqua, Niacinamide, Aloe Vera",
      skinTypes: ["berminyak", "kombinasi", "normal"],
      basePrice: 130000,
      variants: [{ variantName: "30ml", sku: "OGM-30", price: 130000, stock: 35 }],
    },
    {
      categoryId: serum.id,
      name: "Niacinamide 10% Serum",
      slug: "niacinamide-10-serum",
      description: "Serum untuk mencerahkan dan mengontrol minyak berlebih.",
      ingredients: "Aqua, Niacinamide, Zinc PCA",
      skinTypes: ["berminyak", "kombinasi", "normal"],
      basePrice: 110000,
      variants: [{ variantName: "20ml", sku: "NIA-20", price: 110000, stock: 60 }],
    },
    {
      categoryId: serum.id,
      name: "Centella Calming Serum",
      slug: "centella-calming-serum",
      description: "Serum menenangkan untuk kulit sensitif dan mudah kemerahan.",
      ingredients: "Aqua, Centella Asiatica Extract, Panthenol",
      skinTypes: ["sensitif", "kering", "kombinasi"],
      basePrice: 140000,
      variants: [{ variantName: "20ml", sku: "CCS-20", price: 140000, stock: 25 }],
    },
  ];

  for (const p of products) {
    const { variants, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: productData,
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, productId: product.id },
      });
    }

    // No placeholder photo seeded — stock photos don't represent the real
    // product. Admin uploads the real photo via the Cloudinary upload UI;
    // until then the storefront shows a neutral placeholder.
  }

  const quizData: { orderNo: number; text: string; options: { text: string; skinTypeValue: string }[] }[] = [
    {
      orderNo: 1,
      text: "Bagaimana kondisi kulit wajahmu beberapa jam setelah dibersihkan?",
      options: [
        { text: "Terasa kering dan ketarik", skinTypeValue: "kering" },
        { text: "Berminyak di seluruh wajah", skinTypeValue: "berminyak" },
        { text: "Berminyak di T-zone saja, kering di pipi", skinTypeValue: "kombinasi" },
        { text: "Terasa nyaman, tidak kering atau berminyak", skinTypeValue: "normal" },
      ],
    },
    {
      orderNo: 2,
      text: "Apakah kulitmu mudah kemerahan atau iritasi?",
      options: [
        { text: "Ya, sering kemerahan/iritasi", skinTypeValue: "sensitif" },
        { text: "Kadang-kadang saja", skinTypeValue: "kombinasi" },
        { text: "Jarang sekali", skinTypeValue: "normal" },
        { text: "Tidak pernah", skinTypeValue: "berminyak" },
      ],
    },
    {
      orderNo: 3,
      text: "Seberapa sering pori-pori wajahmu terlihat besar?",
      options: [
        { text: "Hampir tidak terlihat", skinTypeValue: "kering" },
        { text: "Terlihat jelas di seluruh wajah", skinTypeValue: "berminyak" },
        { text: "Terlihat hanya di hidung dan dahi", skinTypeValue: "kombinasi" },
        { text: "Terlihat samar, merata", skinTypeValue: "normal" },
      ],
    },
  ];

  for (const q of quizData) {
    let question = await prisma.skinQuizQuestion.findFirst({ where: { orderNo: q.orderNo } });
    if (!question) {
      question = await prisma.skinQuizQuestion.create({ data: { orderNo: q.orderNo, text: q.text } });
      for (const o of q.options) {
        await prisma.skinQuizOption.create({ data: { ...o, questionId: question.id } });
      }
    }
  }

  console.log("Seed complete. Admin login: admin@skincare.test / Admin123!");
  console.log("Customer login: dinda@skincare.test / Customer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
