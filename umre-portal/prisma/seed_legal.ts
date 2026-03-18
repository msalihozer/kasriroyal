import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const legalPages = [
  {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    content: `
      <h2>1. Veri Sorumlusu</h2>
      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz; veri sorumlusu olarak Kasrı Royal Turizm (“Şirket”) tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>
      <h2>2. Kişisel Verilerin Hangi Amaçla İşleneceği</h2>
      <p>Toplanan kişisel verileriniz, Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, ürün ve hizmetlerimizin beğeni, kullanım alışkanlıkları ve ihtiyaçlarınıza göre özelleştirilerek sizlere önerilmesi amacıyla işlenmektedir.</p>
      <h2>3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği</h2>
      <p>Toplanan kişisel verileriniz; Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, Şirketimiz tarafından sunulan ürün ve hizmetlerin sizlerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek sizlere önerilmesi amaçlarıyla; iş ortaklarımıza, tedarikçilerimize, kanunen yetkili kamu kurumlarına aktarılabilecektir.</p>
    `
  },
  {
    slug: 'gizlilik-politikasi',
    title: 'Gizlilik Politikası',
    content: `
      <p>Kasrı Royal olarak, ziyaretçilerimizin gizliliğini korumak önceliğimizdir. Bu gizlilik politikası, web sitemizi kullandığınızda toplanan bilgi türlerini ve bunların nasıl kullanıldığını ana hatlarıyla belirtmektedir.</p>
      <h2>Log Dosyaları</h2>
      <p>Web sitemiz standart günlük dosyalarını kullanır. Bu dosyalar ziyaretçileri siteye giriş yaptıklarında kaydeder. Toplanan bilgiler arasında IP adresleri, tarayıcı türü, İnternet Servis Sağlayıcısı (ISS), tarih/saat damgası gibi bilgiler yer alır.</p>
      <h2>Çerezler</h2>
      <p>Diğer web siteleri gibi web sitemiz de 'çerezler' kullanır. Bu çerezler, ziyaretçilerin tercihlerini ve ziyaretçinin eriştiği veya ziyaret ettiği web sitesindeki sayfaları dahil olmak üzere bilgileri depolamak için kullanılır.</p>
    `
  },
  {
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    content: `
      <p>İşbu Çerez Politikası; Kasrı Royal tarafından yürütülen internet sitesi için geçerli olup, çerez kullanımına ilişkin ilkeleri açıklamaktadır.</p>
      <h2>Çerez Nedir?</h2>
      <p>Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler web sitesinin daha verimli çalışmasını sağlamak, ayrıca site sahiplerine bilgi iletmek için yaygın olarak kullanılır.</p>
      <h2>Çerezleri Nasıl Kullanıyoruz?</h2>
      <p>Sitemizde yer alan çerezleri sitemizin performansını artırmak, kullanıcı deneyimini iyileştirmek ve size daha uygun reklamlar sunmak için kullanıyoruz.</p>
    `
  },
  {
    slug: 'mesafeli-satis',
    title: 'Mesafeli Satış Sözleşmesi',
    content: `
      <h2>1. Taraflar</h2>
      <p>İşbu sözleşme, bir tarafta Kasrı Royal (Satıcı) ile diğer tarafta ürünü satın alan kullanıcı (Alıcı) arasında akdedilmiştir.</p>
      <h2>2. Sözleşmenin Konusu</h2>
      <p>İşbu Sözleşme'nin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği turlar ve hizmetlerin satışı ve teslimi ile ilgili olarak Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
      <h2>3. Ödeme Koşulları</h2>
      <p>Sözleşme konusu hizmetin bedeli, seçilen ödeme yöntemi ile tahsil edilir. Tur rezervasyonları için ön ödeme veya tam ödeme şartları geçerlidir.</p>
    `
  },
  {
    slug: 'iptal-iade',
    title: 'İptal ve İade Koşulları',
    content: `
      <h2>İptal Koşulları</h2>
      <p>Tur başlangıç tarihinden 30 gün öncesine kadar yapılan iptallerde ödenen tutarın tamamı iade edilir. 15-30 gün arası iptallerde %50 kesinti uygulanır. 15 günden az süre kalan iptallerde iade yapılmaz.</p>
      <h2>İade Süreci</h2>
      <p>İade işlemleri, iptal onayından sonra 14 iş günü içerisinde Alıcı'nın ödeme yaptığı yöntemle gerçekleştirilir.</p>
    `
  },
  {
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    content: `
      <p>Sitemizi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Sitede yer alan tüm içerikler Kasrı Royal mülkiyetindedir ve izinsiz kopyalanamaz.</p>
      <h2>Hizmet Değişiklikleri</h2>
      <p>Şirket, sitede sunulan hizmetlerde ve fiyatlarda önceden haber vermeksizin değişiklik yapma hakkını saklı tutar.</p>
      <h2>Sorumluluk Reddi</h2>
      <p>Sitemiz üzerinden ulaşılan diğer web sitelerinin içeriklerinden Şirketimiz sorumlu tutulamaz.</p>
    `
  }
];

async function main() {
  console.log('Legal sayfalar yükleniyor...');
  
  for (const page of legalPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        blocks: { content: page.content },
        content: page.content,
        status: 'published',
        publishedAt: new Date(),
        category: 'legal'
      },
      create: {
        slug: page.slug,
        title: page.title,
        blocks: { content: page.content },
        content: page.content,
        status: 'published',
        publishedAt: new Date(),
        category: 'legal'
      }
    });
    console.log(`- ${page.title} (${page.slug}) güncellendi/eklendi.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
