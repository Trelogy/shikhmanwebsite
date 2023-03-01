

let arrUrl = {
  collections: "Shikhman#CollectionS",
  our_works: "Shikhman#WorkS",
}


document.addEventListener("DOMContentLoaded", function () {

  document.querySelector("#blockT2").addEventListener("mousedown", function () {
    window.location = arrUrl.collections
    window.style.cursor="cursor: pointer"
  })
  document.querySelector("#blockT1").addEventListener("mousedown", function () {
    window.location = arrUrl.our_works
  })
  gsap.set(".main_animation_container svg", { opacity: 1 })

  for (let i = 1; i <= 179; i++) {
    let tempLenght = Number((document.querySelector("#line" + i).getTotalLength()).toFixed(0)) + 1;
    gsap.set("#line" + i, { strokeDasharray: tempLenght, strokeDashoffset: tempLenght })
  }
  /////bl
  gsap.set("#blockT1 > *", { autoAlpha: 0 })
  gsap.set("#blockT2 > *", { autoAlpha: 0 })


  gsap.set("#letS", { scale: 0, transformOrigin: "center" })

  const lineAll = gsap.timeline()
    .to("#letS", { duration: 1.5, scale: 1, ease: "back.out(1.2)" })

    .to("#line6", { duration: .25, strokeDashoffset: 0, ease: "none" })
    .to("#line1", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line2", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line3", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line4", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line5", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line7", { duration: .25, strokeDashoffset: 0, ease: "none" }, ">")
    .to("#line8", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line9", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line10", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line11", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line12", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line13", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line14", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line15", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line16", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line17", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line18", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line19", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line20", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line21", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line22", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line23", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line24", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line25", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line26", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line27", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line28", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line29", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line30", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line31", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line32", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line33", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line34", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line35", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line36", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line37", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line38", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line39", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line40", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line41", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line42", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line43", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line44", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line45", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line46", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line47", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line48", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line49", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line50", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line51", { duration: .25, strokeDashoffset: 0, ease: "none" }, ">-.2")
    .to("#line52", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line53", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line54", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    //////////////
    .to("#line55", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<-.2")
    .to("#line56", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line57", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ////////////
    .to("#line58", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line59", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ///////
    .to("#line60", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ///////
    .to("#line61", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line62", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line63", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line64", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line65", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line66", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line67", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line68", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    //////
    .to("#line69", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line70", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ///////////
    .to("#line71", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line72", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line73", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line74", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line75", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line76", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line77", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ////////////
    .to("#line78", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ////////
    .to("#line79", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line80", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    /////////
    .to("#line81", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line82", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line83", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line84", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line85", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line86", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line87", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line88", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ///////////
    .to("#line89", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line90", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line91", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ///////
    .to("#line92", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line93", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line94", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line95", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line96", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line97", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line98", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line99", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line100", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line101", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line102", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line103", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line104", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line105", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line106", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line107", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line108", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line109", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line110", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line111", { duration: .25, strokeDashoffset: 0, ease: "none" }, ">-.2")
    .to("#line112", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line113", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")

    .to("#line114", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line115", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line116", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line117", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line118", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line119", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line120", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line121", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line122", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line123", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ////////////
    .to("#line124", { duration: .25, strokeDashoffset: 0, ease: "none" }, ">-.2")
    .to("#line125", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line126", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line127", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line128", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line129", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line130", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line131", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line132", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line133", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line134", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line135", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line136", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line137", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")

    .to("#line138", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line139", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line140", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line141", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#blockT1 > *", { duration: .25, autoAlpha: 1 }, "<")

    .to("#line143", { duration: .25, strokeDashoffset: 0, ease: "none" }, ">-.2")
    .to("#line144", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line145", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line146", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line147", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    ////////////
    .to("#line174", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line175", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line176", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")


    .to("#line155", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line156", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line158", { duration: .15, strokeDashoffset: 0, ease: "none" }, ">-.05")
    .to("#line159", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line160", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line161", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line162", { duration: .15, strokeDashoffset: 0, ease: "none" }, ">-.1")
    .to("#line177", { duration: .15, strokeDashoffset: 0, ease: "none" }, ">-.1")
    .to("#line178", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line179", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line163", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line164", { duration: .15, strokeDashoffset: 0, ease: "none" }, ">-.1")
    .to("#line165", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line166", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line167", { duration: .15, strokeDashoffset: 0, ease: "none" }, ">-.1")
    .to("#line168", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line169", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line170", { duration: .15, strokeDashoffset: 0, ease: "none" }, ">-.1")
    .to("#line171", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line172", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line173", { duration: .15, strokeDashoffset: 0, ease: "none" }, "<")

    .to("#blockT2 > *", { duration: .1, autoAlpha: 1 }, "<")

    .to("#line148", { duration: .25, strokeDashoffset: 0, ease: "none" }, ">-.2")
    .to("#line149", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line150", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line151", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line152", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line153", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")
    .to("#line154", { duration: .25, strokeDashoffset: 0, ease: "none" }, "<")




  lineAll.duration(3.5)
})