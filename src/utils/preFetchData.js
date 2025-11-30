import { IMG_OFFSET, TOTAL_FRAMES } from "../pages/CharacterPage";


export function prefetchContentAssets() {
  // 1. Prefetch images44
    const images = [
      '/assets/l2d/anon/data/textures/texture_00.png',
      '/assets/l2d/saki/data/textures/texture_00.png',      
      '/assets/l2d/anon/data/textures/texture_01.png',
      '/assets/l2d/saki/data/textures/texture_01.png',
      '/assets/moon.webp',
      '/assets/happy_saki_octo_matching.webp',
      '/assets/bilibili-icon.webp',
      '/assets/nga-icon.webp',
      '/assets/lofter-icon.webp',
    ];
    images.forEach(src => {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = "low"
      img.src = src; // browser caches automatically
  });

  // for ( let i = 1; i <= TOTAL_FRAMES; i++) {
  //   const img = new Image();
  //   img.fetchPriority = "low"
  //   img.src = `/frames/webp_frames/frame_${String(i+IMG_OFFSET).padStart(4, "0")}.webp`;
  // }

  // 2. Prefetch JSON file
//   fetch('/assets/data/relays.json')
//     .then(res => {
//       if (!res.ok) throw new Error('Failed to fetch JSON');
//       return res.json();
//     })
//     .then(data => {
//       console.log('Prefetched JSON:', data);
//     })
//     .catch(err => console.warn('JSON prefetch failed:', err));
  
  // 3. Prefetch moc file
  const models = [
      'anon',
      'saki',
    ];
    models.forEach(model=>{
        fetch(`/assets/l2d/${model}/data/model.moc`, {priority: "low"})
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch XML');
            return res.text(); // parse as text for now
        })
        .then(xmlText => {
            //   console.log('Prefetched XML:', xmlText);
        })
        .catch(err => console.warn('XML prefetch failed:', err));
    })
}