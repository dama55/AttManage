# AttManage
勤怠管理におけるシフトの登録と自動割り当てを可能にするアプリです．
<br />

## サービスURL
[https://att-manage.vercel.app/pages/shift](https://att-manage.vercel.app/pages/shift)
<br />

## サービス概要
本サービスでは，勤怠管理がシフト管理機能，打刻機能，給与計算機能の三つから構成されると考えます．その上で，2025年1月現在は，シフト管理機能に焦点を当て，各従業員ごとのシフトの登録機能やオーナーのシフト要求登録機能，シフトの自動割り当て機能を提供するサービスです．
<br />

## サービスを開発した背景
少子高齢化が進む現代社会にとって，小・中規模事業における人手不足が今後ますます大きな課題となることが予想されます．この問題の解決，もしくは緩和のための糸口の一つとして，単に従業員を増やすだけではなく，事務作業のような本来の事業とは関係の薄い負担をなるべく減らし，少ない従業員数でより効率的に経営することが挙げられます．本サービスでは，事業主様の勤怠管理に関する負担を削減，又は緩和させることを目的とし，シフト管理，打刻，給与計算の三つの主な機能で構成される勤怠管理サービスの実現を目指します．
<br />

## 画面や機能の説明
| トップ画面 |　ログイン画面 |
| ---- | ---- |
| ![Top画面](/docs/img/app-view/welcome_1.1.png) | ![ログイン画面](/docs/img/app-view/login_1.1.png) |
| 登録せずにサービスをお試しいただくためのトライアル機能を実装しました。 | ログインIDとパスワードでの認証機能を実装しました。 |

| 事業者選択画面 |　請求書作成画面 |
| ---- | ---- |
| ![事業者選択画面](/docs/img/app-view/select-business_1.1.png) | ![請求書作成画面](/docs/img/app-view/create-invoice_1.1.png) |
| 登録済みの複数の事業者の中から、請求書を作成したい事業者を選択する機能を実装しました。 | 請求書の作成機能・マスタデータの呼び出し機能・税率変更機能・税率別内訳の計算機能、合計金額の計算機能を実装しました。 |

| 請求書詳細画面 |　PDF出力画面 |
| ---- | ---- |
| ![請求書詳細画面](/docs/img/app-view/invoice-detail_1.1.png) | ![　PDF出力画面](/docs/img/app-view/print-invoice_1.1.png) |
| 請求書データの表示機能を実装しました。 | PDFでの請求書発行機能を実装しました。 |

| 登録するマスタの選択画面 |　マスタの登録画面 |
| ---- | ---- |
| ![請求書詳細画面](/docs/img/app-view/select-master_1.1.png) | ![　PDF出力画面](/docs/img/app-view/master-register-form_1.1.png) |
| 事業者情報と備考欄情報のマスタ登録機能を実装しました。 | マスタ情報の登録をすることで、請求書の作成時にデータを呼び出すことができます。 |
<br />


## 仕様技術
| Category          | Technology Stack                                     |
| ----------------- | --------------------------------------------------   |
| Frontend          | TypeScript, Next.js, CSS, CSS Modules                     |
| Backend           | TypeScript, Next.js                           |
| Infrastructure    | Vercel                          |
| Database          | Supabase                                           |
| Monitoring        | -                                |
| Environment setup | Docker                                               |
| CI/CD             | GitHub Actions                                       |
| Design            | -                                         |
| etc.              | Git, GitHub |

<br />

## システム構成図

<br />

## ER図

<br />

## ファイル構成



<br />

## インストールと実行

作成中．

<br />


## 今後の展望

2025年1月現在は，各従業員ごとのシフトの登録機能やオーナーのシフト要求登録機能，シフトの自動割り当て機能に限らていますが，今後は機能を拡張する可能性があります．

理想的な構想としては，シフト管理，打刻，給与計算の三つの機能を提供し，最終的にはそれら三つを従業員の各自で利用することで，勤怠管理に必要な工程がオーナーの関与無しに自動的に運営されることを目指したいと考えています．

<br />
