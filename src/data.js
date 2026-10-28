// Names checked against J-LIS prefectural offices, 2026-10-28.
const rows = [
['北海道','札幌市','hokkaido','いももち'],['青森県','青森市','aomori','せんべい汁'],
['岩手県','盛岡市','iwate','がんづき'],['宮城県','仙台市','miyagi','ずんだ餅'],
['秋田県','秋田市','akita','きりたんぽ'],['山形県','山形市','yamagata','笹巻き'],
['福島県','福島市','fukushima','いかにんじん'],['茨城県','水戸市','ibaraki','干しいも'],
['栃木県','宇都宮市','tochigi','しもつかれ'],['群馬県','前橋市','gunma','焼きまんじゅう'],
['埼玉県','さいたま市','saitama','いがまんじゅう'],['千葉県','千葉市','chiba','落花生味噌'],
['東京都','新宿区','tokyo','もんじゃ焼き'],['神奈川県','横浜市','kanagawa','かまぼこ'],
['新潟県','新潟市','niigata','笹団子'],['富山県','富山市','toyama','ます寿司'],
['石川県','金沢市','ishikawa','かぶらずし'],['福井県','福井市','fukui','へしこ'],
['山梨県','甲府市','yamanasi','ほうとう'],['長野県','長野市','nagano','おやき'],
['岐阜県','岐阜市','gifu','五平餅'],['静岡県','静岡市','shizuoka','山葵漬け'],
['愛知県','名古屋市','aichi','きしめん'],['三重県','津市','mie','伊勢うどん'],
['滋賀県','大津市','shiga','ふなずし'],['京都府','京都市','kyoto','千枚漬け'],
['大阪府','大阪市','osaka','たこ焼き'],['兵庫県','神戸市','hyogo','イカナゴのくぎ煮'],
['奈良県','奈良市','nara','柿の葉寿司'],['和歌山県','和歌山市','wakayama','梅干し'],
['鳥取県','鳥取市','tottori','とうふちくわ'],['島根県','松江市','shimane','出雲そば'],
['岡山県','岡山市','okayama','柚餅子'],['広島県','広島市','hiroshima','お好み焼き'],
['山口県','山口市','yamaguchi','瓦そば'],['徳島県','徳島市','tokushima','そば米雑炊'],
['香川県','高松市','kagawa','しょうゆ豆'],['愛媛県','松山市','ehime','じゃこ天'],
['高知県','高知市','kochi','かつおのたたき'],['福岡県','福岡市','fukuoka','あまおう','辛子明太子'],
['佐賀県','佐賀市','saga','呉豆腐'],['長崎県','長崎市','nagasaki','かんころ餅'],
['熊本県','熊本市','kumamoto','からし蓮根'],['大分県','大分市','oita','やせうま'],
['宮崎県','宮崎市','miyazaki','チキン南蛮'],['鹿児島県','鹿児島市','kagoshima','かるかん'],
['沖縄県','那覇市','okinawa','サーターアンダーギー']
];
export const prefectures = rows.map(([name, capital, slug, ...specialties], index) => ({
 id:index+1,name,capital,slug,specialties,
 foodSource: index===39 ? 'https://www.pref.fukuoka.lg.jp/contents/tiikisigenn.html' : `https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/area/${slug}.html`
}));
export const TOKYO_NOTE='このゲームでは、都庁がある「新宿区」を答えます。地図帳などでは「東京」と表すこともあります。東京市は現在ありません。';
