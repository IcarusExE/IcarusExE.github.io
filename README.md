# Kenan Kuşçu | 3D Portföy

Kenan Kuşçu'nun projelerini, becerilerini ve deneyimlerini sergileyen kişisel portföy uygulaması.

- Web sitesi: [icarusexe.github.io](https://icarusexe.github.io)
- GitHub: [github.com/IcarusExE](https://github.com/IcarusExE)
- Yönetim paneli: [portfolio.kenankuscu.workers.dev/admin](https://portfolio.kenankuscu.workers.dev/admin/)
- İçerik API'si: [portfolio.kenankuscu.workers.dev/api/content](https://portfolio.kenankuscu.workers.dev/api/content)

## Yapı

Portföy arayüzü Next.js ile statik olarak oluşturulur ve GitHub Pages üzerinde yayınlanır. Profil, sosyal bağlantılar, bölüm metinleri, beceriler, deneyimler ve projeler Cloudflare D1 üzerinde tutulur. Cloudflare Worker hem içerik API'sini hem de yönetim panelini sunar.

İletişim formundan gönderilen mesajlar D1'e kaydedilir ve yalnızca yönetim panelinden görüntülenebilir. API geçici olarak erişilemezse site `src/data/portfolio-content.ts` içindeki Kenan Kuşçu varsayılanlarıyla çalışmaya devam eder.

## Yerel geliştirme

Gereksinimler: Node.js 20.9 veya üzeri ve pnpm 11.

```bash
git clone https://github.com/IcarusExE/IcarusExE.github.io.git
cd IcarusExE.github.io
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır. Kullanılan ortam değişkenleri `.env.example` dosyasında belgelenmiştir.

## İçerik yönetimi

Yönetim panelinden aşağıdaki alanlar kod değişikliği yapmadan güncellenebilir:

- Profil ve sosyal medya bağlantıları
- Site bölüm başlıkları ve açıklamaları
- Beceriler ve 3D klavye bilgileri
- Eğitim ve deneyim geçmişi
- Projeler ve yayın durumları
- İletişim formu mesajları

Yönetici kullanıcı adı, parola özeti ve oturum anahtarı kaynak kodda tutulmaz. Bunlar Cloudflare secret olarak tanımlanır:

```bash
pnpm exec wrangler secret put ADMIN_USERNAME
pnpm exec wrangler secret put ADMIN_PASSWORD_HASH
pnpm exec wrangler secret put SESSION_SECRET
```

## Kontrol ve dağıtım

```bash
pnpm lint
pnpm typecheck
pnpm build
```

`main` dalına gönderilen değişiklikler `.github/workflows/pages.yml` iş akışıyla GitHub Pages'a otomatik dağıtılır.

Worker ve D1 değişiklikleri için:

```bash
pnpm db:remote
pnpm worker:deploy
```

Worker adı `portfolio`, üretim adresi ise `portfolio.kenankuscu.workers.dev` olarak yapılandırılmıştır.

## Proje sahipliği

Bu depo Kenan Kuşçu tarafından `IcarusExE` hesabı altında sürdürülmektedir. Portföy içeriği, kişisel bilgiler ve proje yapılandırması Kenan Kuşçu'ya aittir. Kullanılan açık kaynak paketlerin ve `public/assets/game` altındaki üçüncü taraf varlıkların hakları kendi sahiplerine aittir; ilgili lisans bildirimleri varlık klasörlerinde korunmaktadır.
