# Tarif Defteri

Bu proje, Bulut Bilişim dersi kapsamında geliştirilmiş çift katmanlı bir web uygulamasıdır.

Uygulamanın amacı, kullanıcıların tariflerini sisteme ekleyebilmesi, görüntüleyebilmesi, düzenleyebilmesi, silebilmesi ve kategoriye göre ayırabilmesidir. Ayrıca kullanıcılar tariflere görsel de ekleyebilmektedir.

## Proje Özeti

Projede frontend ve backend yapısı birbirinden ayrı olacak şekilde geliştirilmiştir.

Frontend tarafında kullanıcı arayüzü yer almaktadır. Kullanıcı bu bölüm üzerinden yeni tarif ekleyebilir, mevcut tarifleri görebilir, düzenleyebilir ve silebilir.

Backend tarafında ise Flask ile geliştirilmiş REST API bulunmaktadır. Tarif verileri SQLite veritabanında tutulmaktadır. Böylece uygulama kapatılıp tekrar açılsa bile tarifler sistemde kalmaya devam eder.

## Kullanılan Teknolojiler

Frontend:
- React
- JavaScript
- CSS

Backend:
- Python
- Flask
- REST API

Veritabanı:
- SQLite

Bulut:
- AWS S3 (frontend yayınlama amacıyla)

## Uygulama Özellikleri

- Yeni tarif ekleme
- Tarifleri listeleme
- Tarif düzenleme
- Tarif silme
- Tariflere resim ekleme
- Tarifleri kategoriye göre ayırma
- Tarif verilerini kalıcı olarak veritabanında saklama

## Proje Yapısı

Proje iki ana klasörden oluşmaktadır:

### frontend
Kullanıcı arayüzünü içeren React projesidir.

### backend
Flask ile geliştirilen API ve veritabanı işlemlerini içeren bölümdür.

## Uygulamanın Çalışma Mantığı

Kullanıcı frontend arayüzü üzerinden tarif bilgilerini girer. Bu bilgiler backend tarafına gönderilir. Backend gelen verileri işler ve SQLite veritabanına kaydeder. Daha sonra kayıtlı tarifler tekrar frontend tarafına gönderilir ve kullanıcıya listelenir.

Resim yükleme işlemlerinde kullanıcı tarafından seçilen görseller backend tarafında ilgili klasöre kaydedilir ve tarif kartları üzerinde gösterilir.
