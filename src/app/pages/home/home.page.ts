import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  // slideOpts = {
  //   initialSlide: 1,
  //   speed: 400,
  //   slidesPerView: 3,
  // };

  slideOpts = {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    on: {
      beforeInit: function () {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };

        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(
          this.originalParams,
          overwriteParams
        );
      },
      setTranslate: function () {
        const swiper = this;
        const {
          $el,
          $wrapperEl,
          slides,
          width: swiperWidth,
          height: swiperHeight,
          rtlTranslate: rtl,
          size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find(".swiper-cube-shadow");
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$(
                '<div class="swiper-cube-shadow"></div>'
              );
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find(".swiper-cube-shadow");
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$(
                '<div class="swiper-cube-shadow"></div>'
              );
              $el.append($cubeShadowEl);
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr("data-swiper-slide-index"), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + round * 4 * swiperSize;
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = 3 * swiperSize + swiperSize * 4 * round;
          }
          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          const transform$$1 = `rotateX(${
            isHorizontal ? 0 : -slideAngle
          }deg) rotateY(${
            isHorizontal ? slideAngle : 0
          }deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = slideIndex * 90 + progress * 90;
            if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal
              ? $slideEl.find(".swiper-slide-shadow-left")
              : $slideEl.find(".swiper-slide-shadow-top");
            let shadowAfter = isHorizontal
              ? $slideEl.find(".swiper-slide-shadow-right")
              : $slideEl.find(".swiper-slide-shadow-bottom");
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(
                `<div class="swiper-slide-shadow-${
                  isHorizontal ? "left" : "top"
                }"></div>`
              );
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(
                `<div class="swiper-slide-shadow-${
                  isHorizontal ? "right" : "bottom"
                }"></div>`
              );
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length)
              shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length)
              shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          "-webkit-transform-origin": `50% 50% -${swiperSize / 2}px`,
          "-moz-transform-origin": `50% 50% -${swiperSize / 2}px`,
          "-ms-transform-origin": `50% 50% -${swiperSize / 2}px`,
          "transform-origin": `50% 50% -${swiperSize / 2}px`,
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(
              `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${
                -swiperWidth / 2
              }px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`
            );
          } else {
            const shadowAngle =
              Math.abs(wrapperRotate) -
              Math.floor(Math.abs(wrapperRotate) / 90) * 90;
            const multiplier =
              1.5 -
              (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2 +
                Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2);
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(
              `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${
                swiperHeight / 2 + offset$$1
              }px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`
            );
          }
        }

        const zFactor =
          swiper.browser.isSafari || swiper.browser.isUiWebView
            ? -swiperSize / 2
            : 0;
        $wrapperEl.transform(
          `translate3d(0px,0,${zFactor}px) rotateX(${
            swiper.isHorizontal() ? 0 : wrapperRotate
          }deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`
        );
      },
      setTransition: function (duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find(
            ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
          )
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find(".swiper-cube-shadow").transition(duration);
        }
      },
    },
  };

  data = [
    {
      mal_id: 33352,
      url: "https://myanimelist.net/anime/33352/Violet_Evergarden",
      title: "Violet Evergarden",
      image_url: "https://cdn.myanimelist.net/images/anime/1795/95088.jpg",
      synopsis:
        "The Great War finally came to an end after four long years of conflict; fractured in two, the continent of Telesis slowly began to flourish once again. Caught up in the bloodshed was Violet Evergarden, a young girl raised for the sole purpose of decimating enemy lines. Hospitalized and maimed in a bloody skirmish during the War's final leg, she was left with only words from the person she held dearest, but with no understanding of their meaning.\r\n\r\nRecovering from her wounds, Violet starts a new life working at CH Postal Services after a falling out with her new intended guardian family. There, she witnesses by pure chance the work of an \"Auto Memory Doll,\" amanuenses that transcribe people's thoughts and feelings into words on paper. Moved by the notion, Violet begins work as an Auto Memory Doll, a trade that will take her on an adventure, one that will reshape the lives of her clients and hopefully lead to self-discovery.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-10T15:00:00+00:00",
      episodes: 13,
      members: 830141,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 2,
          type: "anime",
          name: "Kyoto Animation",
          url: "https://myanimelist.net/anime/producer/2/Kyoto_Animation",
        },
      ],
      score: 8.62,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35849,
      url: "https://myanimelist.net/anime/35849/Darling_in_the_FranXX",
      title: "Darling in the FranXX",
      image_url: "https://cdn.myanimelist.net/images/anime/1614/90408.jpg",
      synopsis:
        'In the distant future, humanity has been driven to near-extinction by giant beasts known as Klaxosaurs, forcing the surviving humans to take refuge in massive fortress cities called Plantations. Children raised here are trained to pilot giant mechas known as FranXX—the only weapons known to be effective against the Klaxosaurs—in boy-girl pairs. Bred for the sole purpose of piloting these machines, these children know nothing of the outside world and are only able to prove their existence by defending their race.  \r\n\r\nHiro, an aspiring FranXX pilot, has lost his motivation and self-confidence after failing an aptitude test. Skipping out on his class\' graduation ceremony, Hiro retreats to a forest lake, where he encounters a mysterious girl with two horns growing out of her head. She introduces herself by her codename Zero Two, which is known to belong to an infamous FranXX pilot known as the "Partner Killer." Before Hiro can digest the encounter, the Plantation is rocked by a sudden Klaxosaur attack. Zero Two engages the creature in her FranXX, but it is heavily damaged in the skirmish and crashes near Hiro. Finding her partner dead, Zero Two invites Hiro to pilot the mecha with her, and the duo easily defeats the Klaxosaur in the ensuing fight. With a new partner by his side, Hiro has been given a chance at redemption for his past failures, but at what cost?\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2018-01-13T14:30:00+00:00",
      episodes: 24,
      members: 761585,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 18,
          type: "anime",
          name: "Mecha",
          url: "https://myanimelist.net/anime/genre/18/Mecha",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 56,
          type: "anime",
          name: "A-1 Pictures",
          url: "https://myanimelist.net/anime/producer/56/A-1_Pictures",
        },
        {
          mal_id: 1835,
          type: "anime",
          name: "CloverWorks",
          url: "https://myanimelist.net/anime/producer/1835/CloverWorks",
        },
        {
          mal_id: 803,
          type: "anime",
          name: "Trigger",
          url: "https://myanimelist.net/anime/producer/803/Trigger",
        },
      ],
      score: 7.36,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34577,
      url:
        "https://myanimelist.net/anime/34577/Nanatsu_no_Taizai__Imashime_no_Fukkatsu",
      title: "Nanatsu no Taizai: Imashime no Fukkatsu",
      image_url: "https://cdn.myanimelist.net/images/anime/11/90089.jpg",
      synopsis:
        "The fierce battle between Meliodas, the captain of the Seven Deadly Sins, and the Great Holy Knight Hendrickson has devastating consequences. Armed with the fragments necessary for the revival of the Demon Clan, Hendrickson breaks the seal, allowing the Commandments to escape, all of whom are mighty warriors working directly under the Demon King himself. Through a mysterious connection, Meliodas instantly identifies them; likewise, the 10 Commandments, too, seem to sense his presence.\r\n\r\nAs the demons leave a path of destruction in their wake, the Seven Deadly Sins must find a way to stop them before the Demon Clan drowns Britannia in blood and terror.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-12T21:30:00+00:00",
      episodes: 24,
      members: 608318,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 56,
          type: "anime",
          name: "A-1 Pictures",
          url: "https://myanimelist.net/anime/producer/56/A-1_Pictures",
        },
      ],
      score: 7.98,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35073,
      url: "https://myanimelist.net/anime/35073/Overlord_II",
      title: "Overlord II",
      image_url: "https://cdn.myanimelist.net/images/anime/12/89562.jpg",
      synopsis:
        "Ainz Ooal Gown, the undead sorcerer formerly known as Momonga, has accepted his place in this new world. Though it bears similarities to his beloved virtual reality game Yggdrasil, it still holds many mysteries which he intends to uncover, by utilizing his power as ruler of the Great Tomb of Nazarick. However, ever since the disastrous brainwashing of one of his subordinates, Ainz has become wary of the impending dangers of the Slane Theocracy, as well as the possible existence of other former Yggdrasil players. Meanwhile, Albedo, Demiurge and the rest of Ainz's loyal guardians set out to prepare for the next step in their campaign: Nazarick's first war…\r\n\r\nOverlord II picks up immediately after its prequel, continuing the story of Ainz Ooal Gown, his eclectic army of human-hating guardians, and the many hapless humans affected by the Overlord's arrival.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-09T13:30:00+00:00",
      episodes: 13,
      members: 549642,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 11,
          type: "anime",
          name: "Game",
          url: "https://myanimelist.net/anime/genre/11/Game",
        },
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 11,
          type: "anime",
          name: "Madhouse",
          url: "https://myanimelist.net/anime/producer/11/Madhouse",
        },
      ],
      score: 7.82,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35860,
      url: "https://myanimelist.net/anime/35860/Karakai_Jouzu_no_Takagi-san",
      title: "Karakai Jouzu no Takagi-san",
      image_url: "https://cdn.myanimelist.net/images/anime/1591/95091.jpg",
      synopsis:
        "Having a friend that knows you inside out should be a good thing, but in Nishikata's case, the opposite is true.\r\n\r\nHis classmate Takagi loves to tease him on a daily basis, and she uses her extensive knowledge of his behavior to predict exactly how he will react to her teasing, making it nearly impossible for Nishikata to ever make a successful comeback. Despite this, Nishikata vows to someday give Takagi a taste of her own medicine by making her blush out of embarrassment from his teasing.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-08T14:00:00+00:00",
      episodes: 12,
      members: 301277,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 247,
          type: "anime",
          name: "Shin-Ei Animation",
          url: "https://myanimelist.net/anime/producer/247/Shin-Ei_Animation",
        },
      ],
      score: 7.81,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35839,
      url: "https://myanimelist.net/anime/35839/Sora_yori_mo_Tooi_Basho",
      title: "Sora yori mo Tooi Basho",
      image_url: "https://cdn.myanimelist.net/images/anime/6/89879.jpg",
      synopsis:
        "Filled with an overwhelming sense of wonder for the world around her, Mari Tamaki has always dreamt of what lies beyond the reaches of the universe. However, despite harboring such large aspirations on the inside, her fear of the unknown and anxiety over her own possible limitations have always held her back from chasing them. But now, in her second year of high school, Mari is more determined than ever to not let any more of her youth go to waste. Still, her fear continues to prevent her from taking that ambitious step forward—that is, until she has a chance encounter with a girl who has grand dreams of her own.\r\n\r\nSpurred by her mother's disappearance, Shirase Kobuchizawa has been working hard to fund her trip to Antarctica. Despite facing doubt and ridicule from virtually everyone, Shirase is determined to embark on this expedition to search for her mother in a place further than the universe itself. Inspired by Shirase's resolve, Mari jumps at the chance to join her. Soon, their efforts attract the attention of the bubbly Hinata Miyake, who is eager to stand out, and Yuzuki Shiraishi, a polite girl from a high class background. Together, they set sail toward the frozen south.\r\n\r\nSora yori mo Tooi Basho follows the captivating journey of four spirited girls, all in search of something great.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-02T11:30:00+00:00",
      episodes: 13,
      members: 293204,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 11,
          type: "anime",
          name: "Madhouse",
          url: "https://myanimelist.net/anime/producer/11/Madhouse",
        },
      ],
      score: 8.59,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34497,
      url:
        "https://myanimelist.net/anime/34497/Death_March_kara_Hajimaru_Isekai_Kyousoukyoku",
      title: "Death March kara Hajimaru Isekai Kyousoukyoku",
      image_url: "https://cdn.myanimelist.net/images/anime/4/88911.jpg",
      synopsis:
        "Ichirou Suzuki, a programmer nearing his thirties, is drowning in work. Worn out, he eventually has a chance to catch up on sleep, only to wake up and discover himself in a fantasy RPG world, which is mashed together from the games he was debugging in reality. In this new place, he realizes that not only has his appearance changed to a younger version of himself, but his name has also changed to Satou, a nickname he used while running beta tests on games. \r\n\r\nHowever, before Satou can fully grasp his situation, an army of lizardmen launch an assault on him. Forced to cast a powerful spell in retaliation, Satou wipes them out completely and his level is boosted to 310, effectively maximizing his stats. Now, as a high-leveled adventurer armed with a plethora of skills and no way to return to reality, Satou sets out to explore this magical new world.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-11T14:30:00+00:00",
      episodes: 12,
      members: 287882,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 35,
          type: "anime",
          name: "Harem",
          url: "https://myanimelist.net/anime/genre/35/Harem",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 957,
          type: "anime",
          name: "Connect",
          url: "https://myanimelist.net/anime/producer/957/Connect",
        },
        {
          mal_id: 300,
          type: "anime",
          name: "Silver Link.",
          url: "https://myanimelist.net/anime/producer/300/Silver_Link",
        },
      ],
      score: 6.61,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34382,
      url: "https://myanimelist.net/anime/34382/Citrus",
      title: "Citrus",
      image_url: "https://cdn.myanimelist.net/images/anime/11/89985.jpg",
      synopsis:
        "During the summer of her freshman year of high school, Yuzu Aihara's mother remarried, forcing her to transfer to a new school. To a fashionable socialite like Yuzu, this inconvenient event is just another opportunity to make new friends, fall in love, and finally experience a first kiss. Unfortunately, Yuzu's dreams and style do not conform with her new ultrastrict, all-girls school, filled with obedient shut-ins and overachieving grade-skippers. Her gaudy appearance manages to grab the attention of Mei Aihara, the beautiful and imposing student council president, who immediately proceeds to sensually caress Yuzu's body in an effort to confiscate her cellphone.\r\n\r\nThoroughly exhausted from her first day, Yuzu arrives home and discovers a shocking truth—Mei is actually her new step-sister! Though Yuzu initially tries to be friendly with her, Mei's cold shoulder routine forces Yuzu to begin teasing her. But before Yuzu can finish her sentence, Mei forces her to the ground and kisses her, with Yuzu desperately trying to break free. Once done, Mei storms out of the room, leaving Yuzu to ponder the true nature of her first kiss, and the secrets behind the tortured expression in the eyes of her new sister.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-06T14:30:00+00:00",
      episodes: 12,
      members: 286339,
      genres: [
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 26,
          type: "anime",
          name: "Shoujo Ai",
          url: "https://myanimelist.net/anime/genre/26/Shoujo_Ai",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 911,
          type: "anime",
          name: "Passione",
          url: "https://myanimelist.net/anime/producer/911/Passione",
        },
      ],
      score: 6.55,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34612,
      url: "https://myanimelist.net/anime/34612/Saiki_Kusuo_no_Ψ-nan_2",
      title: "Saiki Kusuo no Ψ-nan 2",
      image_url: "https://cdn.myanimelist.net/images/anime/1961/91383.jpg",
      synopsis:
        "The disastrous life of the gifted psychic Kusuo Saiki continues, despite his utmost effort to live an ordinary life. Although he has certainly grown accustomed to dealing with his troublesome friends—who are his biggest hurdle to achieving a peaceful life—he still has a long way to go. Also joining the usual oddballs are a few new faces whose shenanigans add to Saiki's misery, making his dreams of a hassle-free life a distant fantasy.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-16T16:35:00+00:00",
      episodes: 24,
      members: 258247,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1444,
          type: "anime",
          name: "Egg Firm",
          url: "https://myanimelist.net/anime/producer/1444/Egg_Firm",
        },
        {
          mal_id: 7,
          type: "anime",
          name: "J.C.Staff",
          url: "https://myanimelist.net/anime/producer/7/JCStaff",
        },
      ],
      score: 8.52,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34798,
      url: "https://myanimelist.net/anime/34798/Yuru_Camp△",
      title: "Yuru Camp△",
      image_url: "https://cdn.myanimelist.net/images/anime/4/89877.jpg",
      synopsis:
        "While the perfect getaway for most girls her age might be a fancy vacation with their loved ones, Rin Shima's ideal way of spending her days off is camping alone at the base of Mount Fuji. From pitching her tent to gathering firewood, she has always done everything by herself, and has no plans of leaving her little solitary world.\r\n\r\nHowever, what starts off as one of Rin's usual camping sessions somehow ends up as a surprise get-together for two when the lost Nadeshiko Kagamihara is forced to take refuge at her campsite. Originally intending to see the picturesque view of Mount Fuji for herself, Nadeshiko's plans are disrupted when she ends up falling asleep partway to her destination. Alone and with no other choice, she seeks help from the only other person nearby. Despite their hasty introductions, the two girls nevertheless enjoy the chilly night together, eating ramen and conversing while the campfire keeps them warm. And even after Nadeshiko's sister finally picks her up later that night, both girls silently ponder the possibility of another camping trip together.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-04T14:00:00+00:00",
      episodes: 12,
      members: 250405,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1075,
          type: "anime",
          name: "C-Station",
          url: "https://myanimelist.net/anime/producer/1075/C-Station",
        },
      ],
      score: 8.28,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34279,
      url: "https://myanimelist.net/anime/34279/Grancrest_Senki",
      title: "Grancrest Senki",
      image_url: "https://cdn.myanimelist.net/images/anime/4/89883.jpg",
      synopsis:
        'The continent of Atlatan once again finds itself devoured by the flames of war after a horrific event known as the Great Hall Tragedy. What was supposed to be a joyful occasion that would establish peace between the Fantasia Union and the Factory Alliance, the marriage of Sir Alexis Douse and Lady Marrine Kreische, was instead a tragedy. As the bride and groom walked down the aisle, the ceremony was suddenly interrupted by a powerful convergence of "Chaos," a dark energy from another dimension that corrupts the land and brings forth monsters and demons into the world. From within that energy appeared the Demon Lord of Diabolos, an evil being who instantly murdered the archdukes of both factions, shattering any hope for peace between them.\r\n \r\nHaving failed to prevent this disaster, Siluca Meletes, an Alliance mage, is traveling through the Chaos-infested countryside to study under a master magician. When she is intercepted by a group of soldiers working with the Federation, Siluca is rescued by Theo Cornaro, a young warrior carrying a mysterious "Crest," a magical symbol that gives its wielder the ability to banish Chaos. Bearing no allegiance to a specific domain, Theo hopes to attain the rank of Lord so that he can liberate his home town of Sistina from its tyrannical ruler and the Chaos spreading within it. Impressed by his noble goal, Siluca enters into a magical contract with Theo, and the two embark on a journey to restore balance to their war-torn land.\r\n\r\n[Written by MAL Rewrite]\r\n',
      type: "TV",
      airing_start: "2018-01-05T15:00:00+00:00",
      episodes: 24,
      members: 182103,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 56,
          type: "anime",
          name: "A-1 Pictures",
          url: "https://myanimelist.net/anime/producer/56/A-1_Pictures",
        },
      ],
      score: 7.27,
      licensors: ["Aniplex of America"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34984,
      url: "https://myanimelist.net/anime/34984/Koi_wa_Ameagari_no_You_ni",
      title: "Koi wa Ameagari no You ni",
      image_url: "https://cdn.myanimelist.net/images/anime/1271/90136.jpg",
      synopsis:
        "Akira Tachibana, a reserved high school student and former track runner, has not been able to race the same as she used to since she experienced a severe foot injury. And although she is regarded as attractive by her classmates, she is not interested in the boys around school.\r\n\r\nWhile working part-time at the Garden Cafe, Akira begins to develop feelings for the manager—a 45-year-old man named Masami Kondou—despite the large age gap. Kondou shows genuine concern and kindness toward the customers of his restaurant, which, while viewed by others as soft or weak, draws Akira to him. Spending time together at the restaurant, they grow closer, which only strengthens her feelings. Weighed down by these uncertain emotions, Akira finally resolves to confess, but what will be the result?\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-11T15:55:00+00:00",
      episodes: 12,
      members: 172356,
      genres: [
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 858,
          type: "anime",
          name: "Wit Studio",
          url: "https://myanimelist.net/anime/producer/858/Wit_Studio",
        },
      ],
      score: 7.56,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35330,
      url: "https://myanimelist.net/anime/35330/Poputepipikku",
      title: "Poputepipikku",
      image_url: "https://cdn.myanimelist.net/images/anime/3/88816.jpg",
      synopsis:
        "Poputepipikku turns absurdist comedy up to eleven with its pop culture references and surreal hilarity. With two bonafide high school girl protagonists—the short and exceptionally quick to anger Popuko, and the tall and unshakably calm Pipimi—they throw genres against the wall and don't wait to see what sticks. Parody is interlaced with drama, action, crudeness, and the show's overarching goal—to become a real anime.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-06T16:00:00+00:00",
      episodes: 12,
      members: 152873,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 5,
          type: "anime",
          name: "Dementia",
          url: "https://myanimelist.net/anime/genre/5/Dementia",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
      ],
      source: "4-koma manga",
      producers: [
        {
          mal_id: 437,
          type: "anime",
          name: "Kamikaze Douga",
          url: "https://myanimelist.net/anime/producer/437/Kamikaze_Douga",
        },
      ],
      score: 7.28,
      licensors: ["Funimation", "Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 33047,
      url: "https://myanimelist.net/anime/33047/Fate_Extra__Last_Encore",
      title: "Fate/Extra: Last Encore",
      image_url: "https://cdn.myanimelist.net/images/anime/1122/90836.jpg",
      synopsis:
        'A technological hell masquerading as paradise, Tsukimihara Academy is an artificial high school that serves as the setting for the next Holy Grail War. Created by the Moon Cell computer, the school is inhabited by Earth-projected souls who have even the slightest aptitude for being a "Master." Of these 256 souls, 128 will be chosen for the main tournament and granted a Servant. With all of the Masters selected, the Academy activates a purge, targeting the remaining lifeforms for elimination.\r\n\r\nAwakening in a pool of his own blood, Hakuno Kishinami refuses to die. Fueled by unknown feelings of hatred, he vows to fight for survival. As he struggles to escape from a relentless pursuer, he finds a crimson blade plunged into the ground; and by pulling it out, Hakuno summons his own Servant, Saber, who instantly destroys his pursuer in a flurry of rose petals. With his newfound power, Hakuno must now begin his journey to Moon Cell\'s core, the Angelica Cage. There, he will unveil the reason for this artificial world and the secrets of his own blood-soaked past.\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2018-01-27T15:00:00+00:00",
      episodes: 10,
      members: 137146,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
      ],
      source: "Game",
      producers: [
        {
          mal_id: 44,
          type: "anime",
          name: "Shaft",
          url: "https://myanimelist.net/anime/producer/44/Shaft",
        },
      ],
      score: 6.33,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36548,
      url: "https://myanimelist.net/anime/36548/Kokkoku",
      title: "Kokkoku",
      image_url: "https://cdn.myanimelist.net/images/anime/8/89987.jpg",
      synopsis:
        "Having failed 19 job interviews in one day, Juri Yukawa's dreams of moving out of her parents' home are utterly dashed. Stuck living with her working mother Nobuko, NEET brother Tsubasa, laid-off father Takafumi, and single-parent sister Sanae, the only hope for this family to raise a decent adult is her little nephew Makoto. However, this struggling family's life takes a turn for the worse when Makoto and Tsubasa are violently kidnapped by a mysterious organization and held for ransom. With only 30 minutes to deliver five million yen to the criminals, Juri's grandfather reveals a dangerously powerful secret to her and Takafumi.\r\n\r\nBy offering blood to her grandfather's mystical stone, the three enter the world of \"Stasis,\" a version of their world where time stops for everyone but the users. Having arrived at their destination, their rescue efforts go awry when they are assailed by a surprising group of people who are somehow able to move around within Stasis. While all hope seems lost, a monstrous giant known only as the Herald appears amidst the chaos, its intent and motivations as cryptic as the very nature of this timeless world.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-07T15:30:00+00:00",
      episodes: 12,
      members: 131504,
      genres: [
        {
          mal_id: 40,
          type: "anime",
          name: "Psychological",
          url: "https://myanimelist.net/anime/genre/40/Psychological",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 7,
          type: "anime",
          name: "Mystery",
          url: "https://myanimelist.net/anime/genre/7/Mystery",
        },
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1393,
          type: "anime",
          name: "Geno Studio",
          url: "https://myanimelist.net/anime/producer/1393/Geno_Studio",
        },
      ],
      score: 7.06,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36516,
      url: "https://myanimelist.net/anime/36516/Beatless",
      title: "Beatless",
      image_url: "https://cdn.myanimelist.net/images/anime/1986/90184.jpg",
      synopsis:
        "With great advancements in technology, mankind has created hIEs, human-like robots that act as public and personal servants for society. Unlike many others, the kind-hearted high school student Arato Endou treats hIEs as equals, but his financial situation keeps him from ever owning one.\r\n\r\nHowever, his normal life is shattered when an ordinary run to the local grocery store goes horribly awry. Viciously assaulted by a hacked hIE, Arato is on the verge of death; but luckily, he is saved by an abnormal hIE carrying a weaponized coffin. Her name is Lacia, one of five highly advanced hIEs that recently escaped the clutches of the mysterious MemeFrame Corporation.\r\n\r\nFaced with a hacked car threatening to run them over, Lacia offers Arato a deal: in exchange for saving his life, he must register as her new owner, thus taking full responsibility for her actions. With little choice, he decides to trust this artificial girl and allows her to live in his home. Though Lacia begins to adapt to her new, peaceful lifestyle, she warns the entranced Arato of one thing—she does not have a soul.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-12T16:55:00+00:00",
      episodes: 20,
      members: 125574,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 51,
          type: "anime",
          name: "Diomedea",
          url: "https://myanimelist.net/anime/producer/51/Diomedea",
        },
      ],
      score: 6.2,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35222,
      url: "https://myanimelist.net/anime/35222/Gakuen_Babysitters",
      title: "Gakuen Babysitters",
      image_url: "https://cdn.myanimelist.net/images/anime/8/89978.jpg",
      synopsis:
        "After losing both parents in a fatal plane crash, teenager Ryuuichi Kashima must adjust to his new life as the guardian of his younger brother Kotarou. Although Ryuuichi is able to maintain a friendly and kindhearted demeanor, Kotarou is a reserved toddler still too young to understand the reality of the situation. At their parents' funeral, they are approached by Youko Morinomiya, the stern chairman of an elite academy, who decides to take them under her care.\r\n \r\nHowever, there is one condition Ryuuichi must fulfill in exchange for a roof over their heads and enrolment in the school—he must become the school's babysitter. In an effort to support the female teachers at the academy, a babysitter's club was established to look after their infant children; unfortunately, the club is severely short-staffed, so now not only is Ryuuichi responsible for his little brother, but also a handful of toddlers who possess dynamic personalities.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-07T14:00:00+00:00",
      episodes: 12,
      members: 124544,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 25,
          type: "anime",
          name: "Shoujo",
          url: "https://myanimelist.net/anime/genre/25/Shoujo",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 112,
          type: "anime",
          name: "Brain's Base",
          url: "https://myanimelist.net/anime/producer/112/Brains_Base",
        },
      ],
      score: 7.83,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34964,
      url: "https://myanimelist.net/anime/34964/Killing_Bites",
      title: "Killing Bites",
      image_url: "https://cdn.myanimelist.net/images/anime/13/90087.jpg",
      synopsis:
        "After unknowingly participating in a kidnapping, college student Yuuya Nomoto finds his friends brutally murdered by Hitomi Uzaki, the high school girl they attempted to abduct. Forced to drive her to an undisclosed location, he finds himself being wagered as the prize for a death match between two Therianthropes, superpowered human-animal hybrids created through advanced gene therapy. As one of these hybrids, Hitomi uses the speed and fearlessness she gained from her ratel genes to viciously dispatch her foe and save Yuuya from certain death.\r\n\r\nWaking up hours later hoping the whole event was only a nightmare, Yuuya realizes that he has become embroiled in a secret proxy war between four large Japanese business conglomerates, with the winner taking control of the economy. As her sole albeit unwilling investor, his life is now directly linked to Hitomi's ability to participate in underground bloodsport matches known only as Killing Bites.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-12T17:25:00+00:00",
      episodes: 12,
      members: 117718,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 9,
          type: "anime",
          name: "Ecchi",
          url: "https://myanimelist.net/anime/genre/9/Ecchi",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 839,
          type: "anime",
          name: "LIDENFILMS",
          url: "https://myanimelist.net/anime/producer/839/LIDENFILMS",
        },
      ],
      score: 6.67,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35905,
      url: "https://myanimelist.net/anime/35905/Ryuuou_no_Oshigoto",
      title: "Ryuuou no Oshigoto!",
      image_url: "https://cdn.myanimelist.net/images/anime/12/89979.jpg",
      synopsis:
        'Shogi, a Japanese game similar to chess, is one of the most popular board games in the country, played by everyone from children to the elderly. Some players are talented enough to take the game to a professional level. The title of Ryuuou, meaning "the dragon king," is only awarded to the person who reaches the pinnacle of competitive shogi.\r\n\r\nYaichi Kuzuryuu has just become the youngest Ryuuou after winning the grand championship. However, the shogi community is unwelcoming to his victory, some even calling him the worst Ryuuou in history. Moreover, he forgets about the agreement he made with Ai Hinatsuru, a little girl he promised to coach if he won. After she shows up at his doorstep, he reluctantly agrees to uphold his promise and makes Ai his disciple.\r\n\r\nTogether, they aim to improve and exceed the limits of their shogi prowess: Ai, to unlock her hidden talents; Yaichi, to prove to the world that he deserves his accomplishments.\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2018-01-08T13:00:00+00:00",
      episodes: 12,
      members: 116072,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 11,
          type: "anime",
          name: "Game",
          url: "https://myanimelist.net/anime/genre/11/Game",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 439,
          type: "anime",
          name: "Project No.9",
          url: "https://myanimelist.net/anime/producer/439/Project_No9",
        },
      ],
      score: 6.95,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35889,
      url: "https://myanimelist.net/anime/35889/Hakata_Tonkotsu_Ramens",
      title: "Hakata Tonkotsu Ramens",
      image_url: "https://cdn.myanimelist.net/images/anime/1718/91097.jpg",
      synopsis:
        "Although the city of Fukuoka might look relatively peaceful at first glance, in actuality it houses a thriving mixture of dangerous individuals such as killers, detectives, and professional revenge seekers right beneath its surface. Among their number is Zenji Banba, a laidback and observant detective who is investigating the work of other hitmen companies in the area. However, Banba might not be the only one with a bone to pick with these organizations, as Xianming Lin, a crossdressing male hitman in the employ of one such company begins getting fed up with his lack of jobs and pay.\r\n\r\nOne day, after Lin's current target commits suicide before the hitman could reach him, his company refuses to pay him even half the amount they were originally supposed to for the assassination. Frustrated, Lin requests another mission and is offered the job of taking out Banba, whom his organization believes has been interfering with their business. However, when Banba arrives at his home and finds the hitman inside, Lin surprisingly doesn't even attempt to kill him. Instead, he offers the detective another option: to join him and form a team. With the offer on the table, exactly how will Banba respond, and just what plans does Lin have in store for the underground world of Fukuoka?\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-12T13:30:00+00:00",
      episodes: 12,
      members: 110500,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
      ],
      source: "Novel",
      producers: [
        {
          mal_id: 41,
          type: "anime",
          name: "Satelight",
          url: "https://myanimelist.net/anime/producer/41/Satelight",
        },
      ],
      score: 7.44,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36838,
      url:
        "https://myanimelist.net/anime/36838/Gintama__Shirogane_no_Tamashii-hen",
      title: "Gintama.: Shirogane no Tamashii-hen",
      image_url: "https://cdn.myanimelist.net/images/anime/12/89603.jpg",
      synopsis: "First Season of the final arc of Gintama.",
      type: "TV",
      airing_start: "2018-01-07T16:35:00+00:00",
      episodes: 12,
      members: 104074,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 13,
          type: "anime",
          name: "Historical",
          url: "https://myanimelist.net/anime/genre/13/Historical",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
        {
          mal_id: 21,
          type: "anime",
          name: "Samurai",
          url: "https://myanimelist.net/anime/genre/21/Samurai",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1258,
          type: "anime",
          name: "Bandai Namco Pictures",
          url:
            "https://myanimelist.net/anime/producer/1258/Bandai_Namco_Pictures",
        },
      ],
      score: 8.79,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36049,
      url: "https://myanimelist.net/anime/36049/Dagashi_Kashi_2",
      title: "Dagashi Kashi 2",
      image_url: "https://cdn.myanimelist.net/images/anime/1649/90141.jpg",
      synopsis: "Second season of Dagashi Kashi.",
      type: "TV",
      airing_start: "2018-01-11T17:28:00+00:00",
      episodes: 12,
      members: 101912,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 200,
          type: "anime",
          name: "Tezuka Productions",
          url: "https://myanimelist.net/anime/producer/200/Tezuka_Productions",
        },
      ],
      score: 6.91,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 33354,
      url:
        "https://myanimelist.net/anime/33354/Cardcaptor_Sakura__Clear_Card-hen",
      title: "Cardcaptor Sakura: Clear Card-hen",
      image_url: "https://cdn.myanimelist.net/images/anime/1467/90338.jpg",
      synopsis:
        "With all of the Clow Cards recaptured and changed into her own Sakura Cards, Sakura Kinomoto now enters her first year at Tomoeda Middle School. After her initial day of classes, Sakura reunites with her love Shaoran Li, who informs her that he is permanently moving back to Tomoeda. Much to her surprise, it even turns out that Shaoran will attend the same school and it seems as if Sakura's life is heading in all the right directions.\r\n\r\nHowever, when Sakura goes to sleep, she encounters in her dream a mysterious cloaked figure and finds herself surrounded by transparent cards. Waking up in fear, Sakura is shocked to see her dream has come true, with the Sakura Cards having turned clear. Continued dreamlike encounters with the unknown enemy and her gaining a new magical key sets the stage for Cardcaptor Sakura's latest adventure!\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-06T22:30:00+00:00",
      episodes: 22,
      members: 84884,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 25,
          type: "anime",
          name: "Shoujo",
          url: "https://myanimelist.net/anime/genre/25/Shoujo",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 11,
          type: "anime",
          name: "Madhouse",
          url: "https://myanimelist.net/anime/producer/11/Madhouse",
        },
      ],
      score: 7.68,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36124,
      url: "https://myanimelist.net/anime/36124/Itou_Junji__Collection",
      title: "Itou Junji: Collection",
      image_url: "https://cdn.myanimelist.net/images/anime/7/88366.jpg",
      synopsis:
        "In the light of day and in the dead of night, mysterious horrors await in the darkest shadows of every corner. They are unexplainable, inescapable, and undefeatable. Be prepared, or you may become their next victim.\r\n\r\nSit back in terror as traumatizing tales of unparalleled terror unfold. Tales, such as that of a cursed jade carving that opens holes all over its victims' bodies; deep nightmares that span decades; an attractive spirit at a misty crossroad that grants cursed advice; and a slug that grows inside a girl's mouth. Tread carefully, for the horrifying supernatural tales of the Itou Junji: Collection are not for the faint of heart.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-05T13:30:00+00:00",
      episodes: 12,
      members: 82097,
      genres: [
        {
          mal_id: 7,
          type: "anime",
          name: "Mystery",
          url: "https://myanimelist.net/anime/genre/7/Mystery",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 14,
          type: "anime",
          name: "Horror",
          url: "https://myanimelist.net/anime/genre/14/Horror",
        },
        {
          mal_id: 6,
          type: "anime",
          name: "Demons",
          url: "https://myanimelist.net/anime/genre/6/Demons",
        },
        {
          mal_id: 40,
          type: "anime",
          name: "Psychological",
          url: "https://myanimelist.net/anime/genre/40/Psychological",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 41,
          type: "anime",
          name: "Thriller",
          url: "https://myanimelist.net/anime/genre/41/Thriller",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 37,
          type: "anime",
          name: "Studio Deen",
          url: "https://myanimelist.net/anime/producer/37/Studio_Deen",
        },
      ],
      score: 6.15,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35828,
      url: "https://myanimelist.net/anime/35828/Miira_no_Kaikata",
      title: "Miira no Kaikata",
      image_url: "https://cdn.myanimelist.net/images/anime/1486/93811.jpg",
      synopsis:
        "High school student Sora Kashiwagi is accustomed to receiving bizarre presents from his father, who is on an expedition around the world. Unfortunately, these gifts have been nothing but nightmares. As a result, when his father sends him a huge package from Egypt, Sora prepares himself for the worst, only to be greeted by Mii-kun—a cute, pint-sized mummy! While initially wary, Sora soon learns that Mii-kun is harmless, a delicate creature yearning for attention.\r\n\r\nThroughout their amusing day-to-day lives, the unlikely pair meet other people with unique pets, while also strengthening their bond together. Although keeping a pet is a difficult task, Sora is set on caring for the lovable Mii-kun.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-11T16:58:00+00:00",
      episodes: 12,
      members: 71864,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
      ],
      source: "Web manga",
      producers: [
        {
          mal_id: 441,
          type: "anime",
          name: "8bit",
          url: "https://myanimelist.net/anime/producer/441/8bit",
        },
      ],
      score: 7.44,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35078,
      url: "https://myanimelist.net/anime/35078/Mitsuboshi_Colors",
      title: "Mitsuboshi Colors",
      image_url: "https://cdn.myanimelist.net/images/anime/5/89984.jpg",
      synopsis:
        "Residing within Tokyo's district of Ueno are the Colors, three individuals who protect their city by performing good deeds and aiding their community. Or, at the very least, they pretend to be the city's defenders. In reality, the Colors are just three young girls: the shy Yui Akamatsu, the noisy Sacchan, and the video game-loving Kotoha, who spend their time playing make-believe and exploring the city. The Colors' activities are facilitated by the grandfatherly Daigorou \"Pops\" Kujiraoka, who uses his store's inventory of knick-knacks to entertain the rambunctious trio.\r\n\r\nNot everyone is a fan of the Colors though. The local policeman Saitou just wants to deal with his regular duties, but he often finds himself the target of the Colors' attention, having been made the villain in most of their fantasies. But despite his personal feelings, Saitou always finds the time to go along with the three girls' games. Even though the Colors do not actually defend Ueno, they definitely help brighten everyone's day.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-07T13:30:00+00:00",
      episodes: 12,
      members: 67844,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 300,
          type: "anime",
          name: "Silver Link.",
          url: "https://myanimelist.net/anime/producer/300/Silver_Link",
        },
      ],
      score: 7.45,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35589,
      url: "https://myanimelist.net/anime/35589/Toji_no_Miko",
      title: "Toji no Miko",
      image_url: "https://cdn.myanimelist.net/images/anime/13/89885.jpg",
      synopsis:
        'Throughout history, an elite group of shrine maidens known as "Toji" have saved the world from "Aratama," strange and malevolent beings bent on destroying humanity. In modern times, these warriors have been assigned to a special police squad to exterminate Aratama. The government has also set up five elite schools across the country to provide young girls the necessary sword fighting skills to eradicate these monsters and eventually join their fellow Toji in protecting the world.\r\n\r\nA student of one of those five schools, Kanami Etou is chosen to represent Minoseki Academy in a sword fighting tournament, where she meets the mysterious Hiyori Juujou. Although Kanami and Hiyori rise to the top of the tournament, their battle takes an unexpected turn, throwing the world of the Toji into chaos. Likely that the Toji are facing betrayal from within, the two are forced to flee the tournament, clashing with former comrades on the way.\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2018-01-05T12:30:00+00:00",
      episodes: 24,
      members: 58371,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 418,
          type: "anime",
          name: "Studio Gokumi",
          url: "https://myanimelist.net/anime/producer/418/Studio_Gokumi",
        },
      ],
      score: 6.86,
      licensors: ["Crunchyroll", "Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35540,
      url: "https://myanimelist.net/anime/35540/Slow_Start",
      title: "Slow Start",
      image_url: "https://cdn.myanimelist.net/images/anime/4/89982.jpg",
      synopsis:
        "Hana Ichinose, a 17-year-old high school student who is not only introverted, but also insecure and timid, has just moved and will be attending a new school. To make her situation more difficult,  Hana is a \"slow start,\" which means that she missed a year and worries about attending a class where everyone is younger than her.\r\n\r\nDuring her introduction, the teacher reveals it is Hana's birthday, which gives her the jumping-off point  to meet three of her classmates: Tamate Momochi, a charismatic and extroverted girl; Kanmuri Sengoku, who is shy and small; and the popular and pretty Eiko Tokura. Not wanting to lose the chance to make new friends, Hana's interactions with these three mark the beginning of some beautiful relationships that will change her life.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-06T15:30:00+00:00",
      episodes: 12,
      members: 57935,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "4-koma manga",
      producers: [
        {
          mal_id: 1835,
          type: "anime",
          name: "CloverWorks",
          url: "https://myanimelist.net/anime/producer/1835/CloverWorks",
        },
      ],
      score: 7.05,
      licensors: ["Aniplex of America"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35298,
      url: "https://myanimelist.net/anime/35298/Ramen_Daisuki_Koizumi-san",
      title: "Ramen Daisuki Koizumi-san",
      image_url: "https://cdn.myanimelist.net/images/anime/5/89876.jpg",
      synopsis:
        "From standing in the sun for hours to traveling miles away from home, gorgeous high school student Koizumi stops at nothing to fulfill her desire for ramen. But these previously solo trips soon change when Koizumi's classmate Yuu Oosawa develops an infatuation with her, and begins to join Koizumi uninvitedly on her adventures. As Yuu continues to be shocked by Koizumi's enormous appetite, she learns about the endless variety of ramen from, arguably, its greatest connoisseur ever!\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-04T11:00:00+00:00",
      episodes: 12,
      members: 46099,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1299,
          type: "anime",
          name: "AXsiZ",
          url: "https://myanimelist.net/anime/producer/1299/AXsiZ",
        },
        {
          mal_id: 418,
          type: "anime",
          name: "Studio Gokumi",
          url: "https://myanimelist.net/anime/producer/418/Studio_Gokumi",
        },
      ],
      score: 6.52,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36094,
      url: "https://myanimelist.net/anime/36094/Hakumei_to_Mikochi",
      title: "Hakumei to Mikochi",
      image_url: "https://cdn.myanimelist.net/images/anime/1250/91694.jpg",
      synopsis:
        "In a world inhabited by people only a few inches tall, young women Hakumei and Mikochi live together in a house built into a tree. Hakumei is an energetic and tomboyish carpenter, while Mikochi is a feminine and calm tailor. Despite their differences, they get along well and spend their days having fun living their lives in the woods.\r\n\r\nThe two of them spend their time working, going on sightseeing adventures, and taking shopping trips into Tsumiki Marketplace by the ocean. They make many friends along the way, be they sentient woodland creatures like Iwashi the Weasel or fellow miniature people such as the songstress Konju and the inventor Sen.\r\n\r\nHakumei to Mikochi is a relaxing look into the day-to-day lives of its titular characters as they explore and interact with their tiny world which seems to be straight out of a fairy tale.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-12T12:00:00+00:00",
      episodes: 12,
      members: 44237,
      genres: [
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 456,
          type: "anime",
          name: "Lerche",
          url: "https://myanimelist.net/anime/producer/456/Lerche",
        },
      ],
      score: 7.64,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35757,
      url: "https://myanimelist.net/anime/35757/Gin_no_Guardian_II",
      title: "Gin no Guardian II",
      image_url: "https://cdn.myanimelist.net/images/anime/1187/98912.jpg",
      synopsis:
        "At Shinryou Private Academy—an expensive school for wealthy students—one would never expect to find the poverty-stricken Suigin Riku. When he is not working on one of his many part-time jobs to pay his tuition, he can often be found playing the RPG game Dungeon Century, where he has cultivated a relationship with an online friend. However, when Dungeon Century shuts down, he finds out that his crush, the kind-hearted Rei Riku, and his online friend are the same person. \r\n\r\nBut in the aftermath of this revelation, Rei gets kidnapped and taken into Grave Buster, which is a new online game from the creators of Dungeon Century, forcing Suigin to enter the harsh new world of a pay-to-win game in order to save her. Gin no Guardian 2nd Season continues Suigin's quest to rescue Rei, while attempting to solve the mysteries of this strange game.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-13T12:00:00+00:00",
      episodes: 6,
      members: 40668,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Web manga",
      producers: [
        {
          mal_id: 1547,
          type: "anime",
          name: "Blade",
          url: "https://myanimelist.net/anime/producer/1547/Blade",
        },
        {
          mal_id: 1530,
          type: "anime",
          name: "Emon",
          url: "https://myanimelist.net/anime/producer/1530/Emon",
        },
      ],
      score: 6.67,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36847,
      url: "https://myanimelist.net/anime/36847/Nanatsu_no_Bitoku",
      title: "Nanatsu no Bitoku",
      image_url: "https://cdn.myanimelist.net/images/anime/9/89129.jpg",
      synopsis:
        'Set in the same timeline as Sin: Nanatsu no Taizai, Nanatsu no Bitoku follows a group of angels sent from Heaven to look for a potential "Savior" to counter-attack the demonic influence being spread by Lucifer and the other emissaries of Hell.\r\n\r\n(Source: Tokyo Zerostar)',
      type: "TV",
      airing_start: "2018-01-26T15:25:00+00:00",
      episodes: 10,
      members: 36956,
      genres: [
        {
          mal_id: 9,
          type: "anime",
          name: "Ecchi",
          url: "https://myanimelist.net/anime/genre/9/Ecchi",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Other",
      producers: [
        {
          mal_id: 397,
          type: "anime",
          name: "Bridge",
          url: "https://myanimelist.net/anime/producer/397/Bridge",
        },
      ],
      score: 5.22,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35789,
      url: "https://myanimelist.net/anime/35789/Yowamushi_Pedal__Glory_Line",
      title: "Yowamushi Pedal: Glory Line",
      image_url: "https://cdn.myanimelist.net/images/anime/3/88489.jpg",
      synopsis: "Fourth season of the Yowamushi Pedal series.",
      type: "TV",
      airing_start: "2018-01-08T17:05:00+00:00",
      episodes: 25,
      members: 36231,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
        {
          mal_id: 30,
          type: "anime",
          name: "Sports",
          url: "https://myanimelist.net/anime/genre/30/Sports",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 73,
          type: "anime",
          name: "TMS Entertainment",
          url: "https://myanimelist.net/anime/producer/73/TMS_Entertainment",
        },
      ],
      score: 7.58,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36108,
      url: "https://myanimelist.net/anime/36108/Takunomi",
      title: "Takunomi.",
      image_url: "https://cdn.myanimelist.net/images/anime/1869/95731.jpg",
      synopsis:
        "20-year-old Michiru Amatsuki moved to Tokyo after a career change, and now finds herself living in a woman only share house, Stella House Haruno, with a few other women of varying age and occupation. Every night the girls settle down and have a drink or two (or more) as drama ensues.",
      type: "TV",
      airing_start: "2018-01-11T17:43:00+00:00",
      episodes: 12,
      members: 34359,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Web manga",
      producers: [
        {
          mal_id: 1053,
          type: "anime",
          name: "Production IMS",
          url: "https://myanimelist.net/anime/producer/1053/Production_IMS",
        },
      ],
      score: 6.43,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35997,
      url: "https://myanimelist.net/anime/35997/Märchen_Mädchen",
      title: "Märchen Mädchen",
      image_url: "https://cdn.myanimelist.net/images/anime/8/90088.jpg",
      synopsis:
        "Hazuki Kagimura is a socially awkward girl with no friends; and having been recently adopted, she struggles to connect with her new family as well. Her only refuge from this painful reality is between the pages of stories where her vivid imagination allows her to live out her dreams of friendship and adventure. However, one day, an old and mysterious text appears in her book bag. On her way back to the library to return it, Hazuki sees a familiar girl who is seemingly invisible to everyone but her. Deciding to follow her, Hazuki is led a hidden library where a world she thought only existed in her dreams awaits her. \r\n\r\nMärchen Mädchen tells the story of Hazuki's meeting with Shizuka Tsuchimikado, her very first friend, and discovering she has been chosen by the original print of Cinderella to become a powerful mage known as an Origin Master. Hazuki enrolls at Kuzunoha Girl's Magic Academy where she learns to conquer her fears and believe in her ability to create her own amazing story.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-11T12:00:00+00:00",
      episodes: 10,
      members: 33529,
      genres: [
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      source: "Light novel",
      producers: [
        {
          mal_id: 346,
          type: "anime",
          name: "Hoods Entertainment",
          url: "https://myanimelist.net/anime/producer/346/Hoods_Entertainment",
        },
      ],
      score: 5.4,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34839,
      url: "https://myanimelist.net/anime/34839/Sanrio_Danshi",
      title: "Sanrio Danshi",
      image_url: "https://cdn.myanimelist.net/images/anime/13/89890.jpg",
      synopsis:
        "Kouta Hasegawa is a completely normal high school student who likes his Pompompurin stuffed animal, a Sanrio character modelled after a Golden Retriever, which his grandmother gave him when he was young. However, an incident in which other kids accused him of being girly for liking Sanrio characters made him ashamed of his attachment to Pompompurin. \r\n\r\nThrough a series of unexpected events, Kouta ends up meeting others at school who also like Sanrio characters—Yuu Mizuno, a flashy boy who is popular with girls; Shunsuke Yoshino, a member of the soccer team; Ryou Nishimiya, an underclassman who is a library assistant; and Seiichirou Minamoto, the student council president.\r\n\r\nThrough his new friends, Kouta learns that there is no need to be embarrassed for liking Sanrio characters; and together, they aim to create a play for the cultural festival in order to transform his normal school life into a sparkly one.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-06T13:00:00+00:00",
      episodes: 12,
      members: 33374,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 1,
          type: "anime",
          name: "Studio Pierrot",
          url: "https://myanimelist.net/anime/producer/1/Studio_Pierrot",
        },
      ],
      score: 6.6,
      licensors: ["Ponycan USA"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 33899,
      url: "https://myanimelist.net/anime/33899/IDOLiSH7",
      title: "IDOLiSH7",
      image_url: "https://cdn.myanimelist.net/images/anime/1390/90828.jpg",
      synopsis:
        "On her first day of work at her father's small production agency, Tsumugi Takanashi was not expecting to be made the manager of the agency's new male idol group. Though shocked that her father is trusting her with such a major project so soon, Tsumugi vows to do everything she can to support the seven young boys. After seeing how well the boys work as a team, Tsumugi meets with her father and learns that her first job as manager will be to cut four boys from the group. This is because her father believes seven idols are too much to manage, and the current top group, TRIGGER, only has three members.\r\n\r\nAfter holding an impromptu audition, Tsumugi returns to her father and boldly declares that she refuses to cut anyone from the group, as each member has a unique allure which collectively enhances the group's appeal. She returns to the boys and they are thrilled that none of them will get to miss out on their dreams. Together they become IDOLiSH7, and prepare to take on the fiercely competitive world of idols.\r\n\r\n[Written by MAL Rewrite]\r\n",
      type: "TV",
      airing_start: "2018-01-07T13:30:00+00:00",
      episodes: 17,
      members: 31999,
      genres: [
        {
          mal_id: 19,
          type: "anime",
          name: "Music",
          url: "https://myanimelist.net/anime/genre/19/Music",
        },
      ],
      source: "Game",
      producers: [
        {
          mal_id: 1103,
          type: "anime",
          name: "TROYCA",
          url: "https://myanimelist.net/anime/producer/1103/TROYCA",
        },
      ],
      score: 7.84,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35964,
      url: "https://myanimelist.net/anime/35964/Basilisk__Ouka_Ninpouchou",
      title: "Basilisk: Ouka Ninpouchou",
      image_url: "https://cdn.myanimelist.net/images/anime/2/88384.jpg",
      synopsis:
        "It has been 10 years since the war between the Iga and Kouga ninja clans came to an end. The two groups have since made peace, supposedly dispelling the animosity that once existed between them. Hachirou Kouga and Hibiki Iga, the successors of their respective bloodlines, seem to have the perfect conditions for their love to bloom, but not everyone is satisfied with the results of the age-old battle.\r\n\r\nDifferent tales of the final showdown between Gennosuke Kouga and Oboro Iga have spread, leaving Tadanaga Tokugawa—whom the Kouga represented—dissatisfied. As tension between the two clans rises once again, the brewing political climate threatens to keep the two fated lovers apart, just as it had in the previous generation. \r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-08T15:00:00+00:00",
      episodes: 24,
      members: 27325,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 13,
          type: "anime",
          name: "Historical",
          url: "https://myanimelist.net/anime/genre/13/Historical",
        },
        {
          mal_id: 17,
          type: "anime",
          name: "Martial Arts",
          url: "https://myanimelist.net/anime/genre/17/Martial_Arts",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1569,
          type: "anime",
          name: "Seven Arcs Pictures",
          url:
            "https://myanimelist.net/anime/producer/1569/Seven_Arcs_Pictures",
        },
      ],
      score: 5.47,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36840,
      url: "https://myanimelist.net/anime/36840/25-sai_no_Joshikousei",
      title: "25-sai no Joshikousei",
      image_url: "https://cdn.myanimelist.net/images/anime/12/89091.jpg",
      synopsis:
        "Once most students are done with high school, they leave and never come back. However, at 25 years old, Hana Natori  finds herself in the role of a student once more at her aunt's request. \r\n\r\nSince Hana's cousin, Kaho Miyoshi, refuses to go to school, her aunt begs Hana to take Kaho's place, since the two of them are practically identical. But as luck would have it, she is recognized by Okito Kanie—an old classmate from her days in high school—who is now a teacher! With her cover blown, Hana assumes Kanie will expose her secret. But when he suddenly kisses her, she soon learns he has other ideas.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-07T16:00:00+00:00",
      episodes: 12,
      members: 26276,
      genres: [
        {
          mal_id: 9,
          type: "anime",
          name: "Ecchi",
          url: "https://myanimelist.net/anime/genre/9/Ecchi",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      source: "Web manga",
      producers: [
        {
          mal_id: 1759,
          type: "anime",
          name: "Lilix",
          url: "https://myanimelist.net/anime/producer/1759/Lilix",
        },
      ],
      score: 5.54,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36522,
      url: "https://myanimelist.net/anime/36522/Ling_Qi_2",
      title: "Ling Qi 2",
      image_url: "https://cdn.myanimelist.net/images/anime/1328/90485.jpg",
      synopsis:
        "In this new season, we will discover the backstory of Tanmoki and who will learn through his memories who was his ancestor Rakugetsu.\r\n\r\n(Source: ANN)",
      type: "TV",
      airing_start: "2018-02-23T12:00:00+00:00",
      episodes: 12,
      members: 24057,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 28,
          type: "anime",
          name: "Shounen Ai",
          url: "https://myanimelist.net/anime/genre/28/Shounen_Ai",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
      ],
      source: "Web manga",
      producers: [
        {
          mal_id: 1325,
          type: "anime",
          name: "Haoliners Animation League",
          url:
            "https://myanimelist.net/anime/producer/1325/Haoliners_Animation_League",
        },
      ],
      score: 7.5,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 34863,
      url: "https://myanimelist.net/anime/34863/Zoku_Touken_Ranbu__Hanamaru",
      title: "Zoku Touken Ranbu: Hanamaru",
      image_url: "https://cdn.myanimelist.net/images/anime/5/89579.jpg",
      synopsis: "Sequel of Touken Ranbu: Hanamaru.",
      type: "TV",
      airing_start: "2018-01-07T15:00:00+00:00",
      episodes: 12,
      members: 20342,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 13,
          type: "anime",
          name: "Historical",
          url: "https://myanimelist.net/anime/genre/13/Historical",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Game",
      producers: [
        {
          mal_id: 95,
          type: "anime",
          name: "Doga Kobo",
          url: "https://myanimelist.net/anime/producer/95/Doga_Kobo",
        },
      ],
      score: 7.32,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 35988,
      url: "https://myanimelist.net/anime/35988/Dame_x_Prince_Anime_Caravan",
      title: "Dame x Prince Anime Caravan",
      image_url: "https://cdn.myanimelist.net/images/anime/9/87462.jpg",
      synopsis:
        "Inako is a minor country, enclosed by two superior countries: the militaristic Milidonia, with its goal of conquering as much land as possible, and the monotheiestic Selenfalen, devoted to the deity Saint Philia. Ani Inako is the sole princess of her country, and in order to eliminate hostility between the three countries, she is sent as Inako's representative to a peace treaty signing in Selenfalen. However, Ani's hopes of a smooth ceremony are shattered when she meets the eccentric princes from her rival countries.\r\n\r\nWith the treaty binding the three countries together, Ani and the princes must learn to overcome their differences. Together, they search for common ground on which to develop their friendship.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2018-01-10T13:30:00+00:00",
      episodes: 12,
      members: 19993,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Visual novel",
      producers: [
        {
          mal_id: 1693,
          type: "anime",
          name: "Studio Flad",
          url: "https://myanimelist.net/anime/producer/1693/Studio_Flad",
        },
      ],
      score: 6.56,
      licensors: ["Sentai Filmworks"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36029,
      url: "https://myanimelist.net/anime/36029/Hakyuu_Houshin_Engi",
      title: "Hakyuu Houshin Engi",
      image_url: "https://cdn.myanimelist.net/images/anime/11/88796.jpg",
      synopsis:
        "When his clan is wiped out by a beautiful demon, young Taikobo finds himself in charge of the mysterious Houshin Project. Its mission: find all immortals living in the human world and seal them away forever. But who do you trust—and whose side are you really on—when you've been trained to hunt demons by a demon?\r\n\r\n(Source: VIZ Media)",
      type: "TV",
      airing_start: "2018-01-12T13:00:00+00:00",
      episodes: 23,
      members: 16919,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 6,
          type: "anime",
          name: "Demons",
          url: "https://myanimelist.net/anime/genre/6/Demons",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1075,
          type: "anime",
          name: "C-Station",
          url: "https://myanimelist.net/anime/producer/1075/C-Station",
        },
      ],
      score: 5.44,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36593,
      url: "https://myanimelist.net/anime/36593/Hug_tto_Precure",
      title: "Hug tto! Precure",
      image_url: "https://cdn.myanimelist.net/images/anime/1220/92883.jpg",
      synopsis:
        "Nono Hana is an 8th grade student who wants to be a stylish and mature big sister like figure. She always puts on a lovely smile and loves to search for exciting things. One day, Hana meets a baby named Hug-tan and her guardian fairy named Harry who had fallen from the sky. At that exact moment, an evil organization called Dark Tomorrow suddenly appeared! They're trying to forcefully take Hug-tan's Mirai Crystal! In order to protect Hug-tan, Hana wishes to do something to help her, and her wish is granted, as she gains a Mirai Crystal and transforms into Cure Yell. The world is overflowed with Tomorrow Powerer, which is the power to create a brilliant tomorrow, which is crystallized into the Mirai Crystals. If it's stolen, everyone's future will not exist. To protect Hug-tan and everyone's future, Cure Yell will do her best!\r\n\r\n(Source: Pretty Cure Wiki)",
      type: "TV",
      airing_start: "2018-02-03T23:30:00+00:00",
      episodes: 49,
      members: 10159,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 25,
          type: "anime",
          name: "Shoujo",
          url: "https://myanimelist.net/anime/genre/25/Shoujo",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 18,
          type: "anime",
          name: "Toei Animation",
          url: "https://myanimelist.net/anime/producer/18/Toei_Animation",
        },
      ],
      score: 7.73,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36982,
      url: "https://myanimelist.net/anime/36982/Micchiri_Neko",
      title: "Micchiri Neko",
      image_url: "https://cdn.myanimelist.net/images/anime/7/89947.jpg",
      synopsis:
        'The cute and mysterious cat-like creatures called Mitchiri Neko that seem to gather around each other if you leave them alone now get their own anime with a glorious voice cast! The free and happy-go- lucky Mitchiri Neko’s daily life is filled fluff and surreal laughs! Say it with me, "Mitchiri! Mitchiri!"\r\n\r\n(Source: Crunchyroll)',
      type: "TV",
      airing_start: "2018-01-04T08:59:00+00:00",
      episodes: 39,
      members: 6234,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
      ],
      source: "Web manga",
      producers: [
        {
          mal_id: 1769,
          type: "anime",
          name: "helo.inc",
          url: "https://myanimelist.net/anime/producer/1769/heloinc",
        },
      ],
      score: 6.82,
      licensors: [],
      r18: false,
      kids: true,
      continuing: false,
    },
    {
      mal_id: 36784,
      url: "https://myanimelist.net/anime/36784/Hataraku_Onii-san",
      title: "Hataraku Onii-san!",
      image_url: "https://cdn.myanimelist.net/images/anime/10/88930.jpg",
      synopsis:
        "The story centers around the cheerful calico Tapio Chatorazawa and the pessimistic Russian blue Kuehiko Roshihara. The two study in the same college, and also work together on various odd jobs.\r\n\r\n(Source: ANN)",
      type: "TV",
      airing_start: "2018-01-05T12:54:00+00:00",
      episodes: 12,
      members: 5947,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 1265,
          type: "anime",
          name: "Tomovies",
          url: "https://myanimelist.net/anime/producer/1265/Tomovies",
        },
      ],
      score: 6.34,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36196,
      url:
        "https://myanimelist.net/anime/36196/Kaijuu_Girls__Ultra_Kaijuu_Gijinka_Keikaku_2nd_Season",
      title: "Kaijuu Girls: Ultra Kaijuu Gijinka Keikaku 2nd Season",
      image_url: "https://cdn.myanimelist.net/images/anime/2/89222.jpg",
      synopsis:
        "Second Season of Kaijuu Girls: Ultra Kaijuu Gijinka Keikaku.  It is receiving a TV broadcast, not just dTV streaming like the previous season.",
      type: "TV",
      airing_start: "2018-01-09T12:54:00+00:00",
      episodes: 12,
      members: 3864,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 443,
          type: "anime",
          name: "Studio PuYUKAI",
          url: "https://myanimelist.net/anime/producer/443/Studio_PuYUKAI",
        },
      ],
      score: 6.15,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36797,
      url: "https://myanimelist.net/anime/36797/gdMen",
      title: "gdMen",
      image_url: "https://cdn.myanimelist.net/images/anime/4/88981.jpg",
      synopsis:
        "In the series, Light and Yomi are spending their daily lives happily playing video games. One night when everyone else is asleep, Light receives an invitation from Alpha, a messenger for someone named King. Light and Yomi are then sucked into another world, where they must undertake a quest to rescue Princess Melody from the demon lord. Light thinks this must be his destiny, while Yomi thinks it's kind of annoying. They form a party with Alpha to start their quest. Alpha as it turns out is an AI robot, and he has a program that allows them to raise their levels while slowly continuing their adventure.\r\n\r\n(Source: ANN)",
      type: "TV",
      airing_start: "2018-01-08T16:10:00+00:00",
      episodes: 12,
      members: 2325,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 884,
          type: "anime",
          name: "Strawberry Meets Pictures",
          url:
            "https://myanimelist.net/anime/producer/884/Strawberry_Meets_Pictures",
        },
      ],
      score: 5.92,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36531,
      url:
        "https://myanimelist.net/anime/36531/Shinkansen_Henkei_Robo_Shinkalion_The_Animation",
      title: "Shinkansen Henkei Robo Shinkalion The Animation",
      image_url: "https://cdn.myanimelist.net/images/anime/1679/100718.jpg",
      synopsis:
        'Hayato Hayasugi (his last name is a pun on the words for "too fast") and other children will serve as conductors to pilot the Shinkalion. The Shinkalion robots are various models of real-life Japanese bullet trains (shinkansen) that transform into robots to fight an unknown evil to protect the safety and peace of Japan.\r\n\r\nThe children must work together with the adults of the Shinkansen Ultra Evolution Institute (SUEI) to defeat a monster that looks like a jet black bullet train.\r\n\r\n(Source: TBS Global Business)',
      type: "TV",
      airing_start: "2018-01-05T22:00:00+00:00",
      episodes: 76,
      members: 2302,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
        {
          mal_id: 18,
          type: "anime",
          name: "Mecha",
          url: "https://myanimelist.net/anime/genre/18/Mecha",
        },
      ],
      source: "Other",
      producers: [
        {
          mal_id: 28,
          type: "anime",
          name: "OLM",
          url: "https://myanimelist.net/anime/producer/28/OLM",
        },
      ],
      score: 6.74,
      licensors: [],
      r18: false,
      kids: true,
      continuing: false,
    },
    {
      mal_id: 36728,
      url: "https://myanimelist.net/anime/36728/Mameneko",
      title: "Mameneko",
      image_url: "https://cdn.myanimelist.net/images/anime/2/88812.jpg",
      synopsis:
        "The series follows the daily lives of a naughty female cat named Azuki and a quiet male cat named Daizu who live with their owner, a 30 year old office lady, and her extended family, including an otaku elder brother and an adopted shiba inu dog who thinks he's a cat.\r\n\r\n(Source: Crunchyroll)",
      type: "TV",
      airing_start: "2018-01-08T16:05:00+00:00",
      episodes: 12,
      members: 1102,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 856,
          type: "anime",
          name: "Charaction",
          url: "https://myanimelist.net/anime/producer/856/Charaction",
        },
      ],
      score: 6.03,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36894,
      url:
        "https://myanimelist.net/anime/36894/Inazma_Delivery__Dougyousha_Attack-hen",
      title: "Inazma Delivery: Dougyousha Attack-hen",
      image_url: "https://cdn.myanimelist.net/images/anime/4/89278.jpg",
      synopsis: "(No synopsis yet.)",
      type: "TV",
      airing_start: "2017-12-07T15:00:00+00:00",
      episodes: 10,
      members: 459,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 330,
          type: "anime",
          name: "Kanaban Graphics",
          url: "https://myanimelist.net/anime/producer/330/Kanaban_Graphics",
        },
      ],
      score: 6.23,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 36552,
      url: "https://myanimelist.net/anime/36552/Pikachin-Kit",
      title: "Pikachin-Kit",
      image_url: "https://cdn.myanimelist.net/images/anime/12/88334.jpg",
      synopsis:
        'A fifth-year elementary student named Eiji Tōmatsu, and his "inspiration" buddy, a dog named Pochirou. One day Eiji finds a mysterious book called the "Pikachin Research Book," and learns about the seven tools that make up the Pikachin Kit. Eiji presses a button inside the research book, and immediately a "Future Amazon" delivery arrives at his door with the kit. Eiji uses the blueprints included in the box to assemble the kit, but it seems as though 1% part of the kit is still missing. \r\n\r\nIn the franchise, the word "Pikachin" means the flash of inspiration or insight one gets about a new project, similar to the visual of a lightbulb turning on above one\'s head when someone has an idea. The concept of the franchise is "invention is 99% plastic models, 1% inspiration." \r\n\r\n(Source: ANN)',
      type: "TV",
      airing_start: "2018-01-06T00:30:00+00:00",
      episodes: 115,
      members: 274,
      genres: [
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 28,
          type: "anime",
          name: "OLM",
          url: "https://myanimelist.net/anime/producer/28/OLM",
        },
        {
          mal_id: 247,
          type: "anime",
          name: "Shin-Ei Animation",
          url: "https://myanimelist.net/anime/producer/247/Shin-Ei_Animation",
        },
      ],
      score: null,
      licensors: [],
      r18: false,
      kids: true,
      continuing: false,
    },
    {
      mal_id: 37054,
      url:
        "https://myanimelist.net/anime/37054/Sentai_Hero_Sukiyaki_Force__Gunma_no_Heiwa_wo_Negau_Season_e_Mata",
      title:
        "Sentai Hero Sukiyaki Force: Gunma no Heiwa wo Negau Season e, Mata?",
      image_url: "https://cdn.myanimelist.net/images/anime/11/89869.jpg",
      synopsis: "(No synopsis yet.)",
      type: "TV",
      airing_start: "2018-01-14T15:00:00+00:00",
      episodes: 24,
      members: 212,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
        {
          mal_id: 31,
          type: "anime",
          name: "Super Power",
          url: "https://myanimelist.net/anime/genre/31/Super_Power",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 13,
          type: "anime",
          name: "Studio 4°C",
          url: "https://myanimelist.net/anime/producer/13/Studio_4%C2%B0C",
        },
      ],
      score: null,
      licensors: [],
      r18: false,
      kids: false,
      continuing: false,
    },
    {
      mal_id: 37002,
      url: "https://myanimelist.net/anime/37002/Uchi_no_Oochopus",
      title: "Uchi no Oochopus",
      image_url: "https://cdn.myanimelist.net/images/anime/11/89674.jpg",
      synopsis:
        "The main character is the mysterious lifeform Oochopus. In the series, the Oochopus appears at the house of five-year-old Kantarou and three-year-old An-chan. Kantarou and An-chan accept the cute but somewhat irresponsible Oochopus as family.\r\n\r\n(Source: ANN)",
      type: "TV",
      airing_start: "2018-01-09T08:20:00+00:00",
      episodes: 38,
      members: 174,
      genres: [
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
      ],
      source: "Picture book",
      producers: [],
      score: null,
      licensors: [],
      r18: false,
      kids: true,
      continuing: false,
    },
    {
      mal_id: 37244,
      url: "https://myanimelist.net/anime/37244/Gan_Gan_Ganko-chan_2nd_Season",
      title: "Gan Gan Ganko-chan 2nd Season",
      image_url: "https://cdn.myanimelist.net/images/anime/1066/90380.jpg",
      synopsis: "Second season of the Gan Gan Ganko-chan anime series.",
      type: "TV",
      airing_start: "2018-02-03T22:55:00+00:00",
      episodes: 8,
      members: 141,
      genres: [
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 1286,
          type: "anime",
          name: "10Gauge",
          url: "https://myanimelist.net/anime/producer/1286/10Gauge",
        },
      ],
      score: null,
      licensors: [],
      r18: false,
      kids: true,
      continuing: false,
    },
    {
      mal_id: 38075,
      url: "https://myanimelist.net/anime/38075/Titipo_Titipo",
      title: "Titipo Titipo",
      image_url: "https://cdn.myanimelist.net/images/anime/1521/93267.jpg",
      synopsis:
        "Say hi to Tayo's new friend - Titipo! Train Center's new born little train Titipo has just passed the driving examination and is prepared to work at the Train Village. Although Titipo dreams of becoming the best train in the world, his curious yet random personality catches him in unforeseen events and troubles everyday. Titipo expands his experience in the greater world and befriends Genie, Diesel, and other little trains. Will Titipo achieve his dream of becoming the best train? Come join the railroad journey and meet Titipo and the little train friends.\r\n\r\n(Source: Official YouTube channel)",
      type: "TV",
      airing_start: "2018-01-01T08:45:00+00:00",
      episodes: 26,
      members: 111,
      genres: [
        {
          mal_id: 3,
          type: "anime",
          name: "Cars",
          url: "https://myanimelist.net/anime/genre/3/Cars",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
      ],
      source: "Original",
      producers: [],
      score: null,
      licensors: [],
      r18: false,
      kids: true,
      continuing: false,
    },
    {
      mal_id: 21,
      url: "https://myanimelist.net/anime/21/One_Piece",
      title: "One Piece",
      image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      synopsis:
        'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.\r\n\r\nEnter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy’s reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.\r\n\r\n[Written by MAL Rewrite] ',
      type: "TV",
      airing_start: "1999-10-20T00:30:00+00:00",
      episodes: null,
      members: 1124713,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 31,
          type: "anime",
          name: "Super Power",
          url: "https://myanimelist.net/anime/genre/31/Super_Power",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 18,
          type: "anime",
          name: "Toei Animation",
          url: "https://myanimelist.net/anime/producer/18/Toei_Animation",
        },
      ],
      score: 8.48,
      licensors: ["4Kids Entertainment", "Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 34572,
      url: "https://myanimelist.net/anime/34572/Black_Clover",
      title: "Black Clover",
      image_url: "https://cdn.myanimelist.net/images/anime/2/88336.jpg",
      synopsis:
        'Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the "Wizard King"—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King. However, as they grew up, the stark difference between them became evident. While Yuno is able to wield magic with amazing power and control, Asta cannot use magic at all and desperately tries to awaken his powers by training physically.\r\n\r\nWhen they reach the age of 15, Yuno is bestowed a spectacular Grimoire with a four-leaf clover, while Asta receives nothing. However, soon after, Yuno is attacked by a person named Lebuty, whose main purpose is to obtain Yuno\'s Grimoire. Asta tries to fight Lebuty, but he is outmatched. Though without hope and on the brink of defeat, he finds the strength to continue when he hears Yuno\'s voice. Unleashing his inner emotions in a rage, Asta receives a five-leaf clover Grimoire, a "Black Clover" giving him enough power to defeat Lebuty. A few days later, the two friends head out into the world, both seeking the same goal—to become the Wizard King!\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2017-10-03T09:25:00+00:00",
      episodes: null,
      members: 636369,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1,
          type: "anime",
          name: "Studio Pierrot",
          url: "https://myanimelist.net/anime/producer/1/Studio_Pierrot",
        },
      ],
      score: 7.26,
      licensors: ["Crunchyroll", "Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 35062,
      url: "https://myanimelist.net/anime/35062/Mahoutsukai_no_Yome",
      title: "Mahoutsukai no Yome",
      image_url: "https://cdn.myanimelist.net/images/anime/3/88476.jpg",
      synopsis:
        "Chise Hatori, a 15-year-old Japanese girl, was sold for five million pounds at an auction to a tall masked gentleman. Abandoned at a young age and ridiculed by her peers for her unconventional behavior, she was ready to give herself to any buyer if it meant having a place to go home to. In chains and on her way to an unknown fate, she hears whispers from robed men along her path, gossiping and complaining that such a buyer got his hands on a rare \"Sleigh Beggy.\"\r\n\r\nIgnoring the murmurs, the mysterious man leads the girl to a study, where he reveals himself to be Elias Ainsworth—a magus. After a brief confrontation and a bit of teleportation magic, the two open their eyes to Elias' picturesque cottage in rural England. Greeted by fairies and surrounded by weird and wonderful beings upon her arrival, these events mark the beginning of Chise's story as the apprentice and supposed bride of the ancient magus.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2017-10-07T16:30:00+00:00",
      episodes: 24,
      members: 550719,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 16,
          type: "anime",
          name: "Magic",
          url: "https://myanimelist.net/anime/genre/16/Magic",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 858,
          type: "anime",
          name: "Wit Studio",
          url: "https://myanimelist.net/anime/producer/858/Wit_Studio",
        },
      ],
      score: 8.12,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 30694,
      url: "https://myanimelist.net/anime/30694/Dragon_Ball_Super",
      title: "Dragon Ball Super",
      image_url: "https://cdn.myanimelist.net/images/anime/7/74606.jpg",
      synopsis:
        'Seven years after the events of Dragon Ball Z, Earth is at peace, and its people live free from any dangers lurking in the universe. However, this peace is short-lived; a sleeping evil awakens in the dark reaches of the galaxy: Beerus, the ruthless God of Destruction.\r\n\r\nDisturbed by a prophecy that he will be defeated by a "Super Saiyan God," Beerus and his angelic attendant Whis start searching the universe for this mysterious being. Before long, they reach Earth where they encounter Gokuu Son, one of the planet\'s mightiest warriors, and his similarly powerful friends.\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2015-07-05T00:00:00+00:00",
      episodes: 131,
      members: 452367,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 31,
          type: "anime",
          name: "Super Power",
          url: "https://myanimelist.net/anime/genre/31/Super_Power",
        },
        {
          mal_id: 17,
          type: "anime",
          name: "Martial Arts",
          url: "https://myanimelist.net/anime/genre/17/Martial_Arts",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 18,
          type: "anime",
          name: "Toei Animation",
          url: "https://myanimelist.net/anime/producer/18/Toei_Animation",
        },
      ],
      score: 7.48,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 34566,
      url:
        "https://myanimelist.net/anime/34566/Boruto__Naruto_Next_Generations",
      title: "Boruto: Naruto Next Generations",
      image_url: "https://cdn.myanimelist.net/images/anime/9/84460.jpg",
      synopsis:
        "Following the successful end of the Fourth Shinobi World War, Konohagakure has been enjoying a period of peace, prosperity, and extraordinary technological advancement. This is all due to the efforts of the Allied Shinobi Forces and the village's Seventh Hokage, Naruto Uzumaki. Now resembling a modern metropolis, Konohagakure has changed, particularly the life of a shinobi. Under the watchful eye of Naruto and his old comrades, a new generation of shinobi has stepped up to learn the ways of the ninja.\r\n\r\nBoruto Uzumaki is often the center of attention as the son of the Seventh Hokage. Despite having inherited Naruto's boisterous and stubborn demeanor, Boruto is considered a prodigy and is able to unleash his potential with the help of supportive friends and family. Unfortunately, this has only worsened his arrogance and his desire to surpass Naruto which, along with his father's busy lifestyle, has strained their relationship. However, a sinister force brewing within the village may threaten Boruto's carefree life.\r\n\r\nNew friends and familiar faces join Boruto as a new story begins in Boruto: Naruto Next Generations.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2017-04-05T08:30:00+00:00",
      episodes: null,
      members: 421024,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 31,
          type: "anime",
          name: "Super Power",
          url: "https://myanimelist.net/anime/genre/31/Super_Power",
        },
        {
          mal_id: 17,
          type: "anime",
          name: "Martial Arts",
          url: "https://myanimelist.net/anime/genre/17/Martial_Arts",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1,
          type: "anime",
          name: "Studio Pierrot",
          url: "https://myanimelist.net/anime/producer/1/Studio_Pierrot",
        },
      ],
      score: 6.01,
      licensors: ["Viz Media"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 235,
      url: "https://myanimelist.net/anime/235/Detective_Conan",
      title: "Detective Conan",
      image_url: "https://cdn.myanimelist.net/images/anime/7/75199.jpg",
      synopsis:
        "Shinichi Kudou, a high school student of astounding talent in detective work, is well known for having solved several challenging cases. One day, when Shinichi spots two suspicious men and decides to follow them, he inadvertently becomes witness to a disturbing illegal activity. Unfortunately, he is caught in the act, so the men dose him with an experimental drug formulated by their criminal organization, leaving him to his death. However, to his own astonishment, Shinichi lives to see another day, but now in the body of a seven-year-old child.\r\n\r\nPerfectly preserving his original intelligence, he hides his real identity from everyone, including his childhood friend Ran Mouri and her father, private detective Kogorou Mouri. To this end, he takes on the alias of Conan Edogawa, inspired by the mystery writers Arthur Conan Doyle and Ranpo Edogawa.\r\n\r\nDetective Conan follows Shinichi who, as Conan, starts secretly solving the senior Mouri's cases from behind the scenes with his still exceptional sleuthing skills, while covertly investigating the organization responsible for his current state, hoping to reverse the drug's effects someday.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "1996-01-08T09:00:00+00:00",
      episodes: null,
      members: 224181,
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 7,
          type: "anime",
          name: "Mystery",
          url: "https://myanimelist.net/anime/genre/7/Mystery",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 39,
          type: "anime",
          name: "Police",
          url: "https://myanimelist.net/anime/genre/39/Police",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 73,
          type: "anime",
          name: "TMS Entertainment",
          url: "https://myanimelist.net/anime/producer/73/TMS_Entertainment",
        },
      ],
      score: 8.18,
      licensors: ["Crunchyroll", "Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 35180,
      url: "https://myanimelist.net/anime/35180/3-gatsu_no_Lion_2nd_Season",
      title: "3-gatsu no Lion 2nd Season",
      image_url: "https://cdn.myanimelist.net/images/anime/3/88469.jpg",
      synopsis:
        "Now in his second year of high school, Rei Kiriyama continues pushing through his struggles in the professional shogi world as well as his personal life. Surrounded by vibrant personalities at the shogi hall, the school club, and in the local community, his solitary shell slowly begins to crack. Among them are the three Kawamoto sisters—Akari, Hinata, and Momo—who forge an affectionate and familial bond with Rei. Through these ties, he realizes that everyone is burdened by their own emotional hardships and begins learning how to rely on others while supporting them in return. \r\n\r\nNonetheless, the life of a professional is not easy. Between tournaments, championships, and title matches, the pressure mounts as Rei advances through the ranks and encounters incredibly skilled opponents. As he manages his relationships with those who have grown close to him, the shogi player continues to search for the reason he plays the game that defines his career.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2017-10-14T14:00:00+00:00",
      episodes: 22,
      members: 219510,
      genres: [
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 11,
          type: "anime",
          name: "Game",
          url: "https://myanimelist.net/anime/genre/11/Game",
        },
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 44,
          type: "anime",
          name: "Shaft",
          url: "https://myanimelist.net/anime/producer/44/Shaft",
        },
      ],
      score: 9.02,
      licensors: ["Aniplex of America"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 32977,
      url: "https://myanimelist.net/anime/32977/Aggressive_Retsuko",
      title: "Aggressive Retsuko",
      image_url: "https://cdn.myanimelist.net/images/anime/2/84193.jpg",
      synopsis:
        "Whether it be facing misogynistic remarks from her boss or being pressured by condescending co-workers, stress is just another part of the job for 25-year-old red panda Retsuko. Despite being one of the most diligent workers at her office, her diminutiveness and modesty often lead her to be exploited by her colleagues. However, when her irritation hits the limit, Retsuko brings forth her unique brand of letting off steam: aggressive death metal karaoke bashing the idiocy and hypocrisy of her co-workers' actions and work life. Although this venting only takes place in her mind, it gives her an outlet to counter her frustration in a world where hierarchy and appearances reign supreme.\r\n\r\n[Written by MAL Rewrite] ",
      type: "TV",
      airing_start: "2016-04-02T03:00:00+00:00",
      episodes: 100,
      members: 57473,
      genres: [
        {
          mal_id: 19,
          type: "anime",
          name: "Music",
          url: "https://myanimelist.net/anime/genre/19/Music",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
      ],
      source: "Other",
      producers: [
        {
          mal_id: 866,
          type: "anime",
          name: "Fanworks",
          url: "https://myanimelist.net/anime/producer/866/Fanworks",
        },
      ],
      score: 7.64,
      licensors: [],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 34034,
      url: "https://myanimelist.net/anime/34034/Pokemon_Sun___Moon",
      title: "Pokemon Sun & Moon",
      image_url: "https://cdn.myanimelist.net/images/anime/11/84673.jpg",
      synopsis:
        "After his mother wins a free trip to the islands, Pokemon trainer Satoshi and his partner Pikachu head for Melemele Island of the beautiful Alola region, which is filled with lots of new Pokemon and even variations of familiar faces. Eager to explore the island, Satoshi and Pikachu run wild with excitement, quickly losing their way while chasing after a Pokemon. The pair eventually stumbles upon the Pokemon School, an institution where students come to learn more about these fascinating creatures.\r\n\r\nAt the school, when he and one of the students—the no-nonsense Kaki—have a run-in with the nefarious thugs of Team Skull, Satoshi discovers the overwhelming might of the Z-Moves, powerful attacks originating from the Alola region that require the trainer and Pokemon to be in sync. Later that night, he and Pikachu have an encounter with the guardian deity Pokemon of Melemele Island, the mysterious Kapu Kokeko. The Pokemon of legend bestows upon them a Z-Ring, a necessary tool in using the Z-Moves. Dazzled by his earlier battle and now in possession of a Z-Ring, Satoshi and Pikachu decide to stay behind in the Alola Region to learn and master the strength of these powerful new attacks.\r\n\r\nEnrolling in the Pokemon School, Satoshi is joined by classmates such as Lillie, who loves Pokemon but cannot bring herself to touch them, Kaki, and many others. Between attending classes, fending off the pesky Team Rocket—who themselves have arrived in Alola to pave the way for their organization's future plans—and taking on the Island Challenge that is necessary to master the Z-Moves, Satoshi and Pikachu are in for an exciting new adventure.\r\n\r\n[Written by MAL Rewrite]",
      type: "TV",
      airing_start: "2016-11-17T09:00:00+00:00",
      episodes: 146,
      members: 55601,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 11,
          type: "anime",
          name: "Game",
          url: "https://myanimelist.net/anime/genre/11/Game",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      source: "Game",
      producers: [
        {
          mal_id: 28,
          type: "anime",
          name: "OLM",
          url: "https://myanimelist.net/anime/producer/28/OLM",
        },
      ],
      score: 6.95,
      licensors: ["The Pokemon Company International"],
      r18: false,
      kids: true,
      continuing: true,
    },
    {
      mal_id: 36144,
      url: "https://myanimelist.net/anime/36144/Garo__Vanishing_Line",
      title: "Garo: Vanishing Line",
      image_url: "https://cdn.myanimelist.net/images/anime/10/88236.jpg",
      synopsis:
        'Corruption looms over the prosperous Russell City, where manifestations of negative emotions called Horrors cause chaos and mayhem. The Makai Order is the last bastion of hope against these unholy creatures. Using several small businesses as fronts, they deploy powerful Makai Knights and magical Makai Alchemists to combat the Horror threat. \r\n\r\nWithin this secretive order, the highest rank of Golden Knight has been bestowed upon a large, powerful man named Sword, granting him use of the Garo armor and blade. He alone knows of a plot that threatens the entire Makai Order, with his only hint being the phrase “El Dorado." While fighting a Horror, he encounters Sophia "Sophie" Hennis, a teenage girl whose brother\'s disappearance years ago is also linked to the same phrase. The two agree to work together to uncover the truth behind "El Dorado" and the disappearance of Sophie\'s brother.\r\n\r\n[Written by MAL Rewrite]',
      type: "TV",
      airing_start: "2017-10-06T16:23:00+00:00",
      episodes: 24,
      members: 55271,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 6,
          type: "anime",
          name: "Demons",
          url: "https://myanimelist.net/anime/genre/6/Demons",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      source: "Original",
      producers: [
        {
          mal_id: 569,
          type: "anime",
          name: "MAPPA",
          url: "https://myanimelist.net/anime/producer/569/MAPPA",
        },
      ],
      score: 7.19,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 966,
      url: "https://myanimelist.net/anime/966/Crayon_Shin-chan",
      title: "Crayon Shin-chan",
      image_url: "https://cdn.myanimelist.net/images/anime/10/59897.jpg",
      synopsis:
        "Just because an anime features a young protagonist does not necessarily mean that it is an appropriate series to show your children. Young Shinnosuke, or Shin-chan for short, is a very creative young boy that lives with his eccentric parents, Misae and Hiroshi, as well as his Prima Donna younger sister, Himawari, and has loads of unique friends to boot.\r\n\r\nEveryday life for little Shin-chan is full of funny (and shocking) moments, most of which stem from his unnatural and sometimes profane use of language, as well as his constant acts of inappropriate behavior. Shin-chan's famous \"elephant\" gag is one of the most defining moments in Crayon Shin-chan, simply because it is the epitome of crude comedy, one of the core themes of the series.\r\n\r\nCrayon Shin-chan is a hilarious show about the day in the life of a young, curious boy, that captures the awkwardness of growing up as well as the beauty of being true to one's self, no matter what others say.",
      type: "TV",
      airing_start: "1992-04-13T10:30:00+00:00",
      episodes: null,
      members: 51065,
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 9,
          type: "anime",
          name: "Ecchi",
          url: "https://myanimelist.net/anime/genre/9/Ecchi",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 247,
          type: "anime",
          name: "Shin-Ei Animation",
          url: "https://myanimelist.net/anime/producer/247/Shin-Ei_Animation",
        },
      ],
      score: 7.7,
      licensors: ["Funimation"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 35067,
      url: "https://myanimelist.net/anime/35067/Osomatsu-san_2nd_Season",
      title: "Osomatsu-san 2nd Season",
      image_url: "https://cdn.myanimelist.net/images/anime/13/88328.jpg",
      synopsis: "Second season of Osomatsu-san.",
      type: "TV",
      airing_start: "2017-10-02T16:35:00+00:00",
      episodes: 25,
      members: 39277,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
      ],
      source: "Manga",
      producers: [
        {
          mal_id: 1,
          type: "anime",
          name: "Studio Pierrot",
          url: "https://myanimelist.net/anime/producer/1/Studio_Pierrot",
        },
      ],
      score: 7.61,
      licensors: ["Viz Media"],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 36259,
      url: "https://myanimelist.net/anime/36259/Pingu_in_the_City",
      title: "Pingu in the City",
      image_url: "https://cdn.myanimelist.net/images/anime/1140/95174.jpg",
      synopsis:
        "Pingu and his family move from their small village to the big city; in which there are many people with many different occupations. The ever-curious Pingu tries to join them at their jobs, but his mischievous side gets the better of him and he ends up messing things up.\r\n\r\n(Source: ANN)",
      type: "TV",
      airing_start: "2017-10-07T00:20:00+00:00",
      episodes: 26,
      members: 35802,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      source: "Other",
      producers: [
        {
          mal_id: 1111,
          type: "anime",
          name: "DandeLion Animation Studio",
          url:
            "https://myanimelist.net/anime/producer/1111/DandeLion_Animation_Studio",
        },
      ],
      score: 6.65,
      licensors: [],
      r18: false,
      kids: true,
      continuing: true,
    },
    {
      mal_id: 34866,
      url: "https://myanimelist.net/anime/34866/Yu☆Gi☆Oh_VRAINS",
      title: "Yu☆Gi☆Oh! VRAINS",
      image_url: "https://cdn.myanimelist.net/images/anime/1789/101971.jpg",
      synopsis:
        "In the city of Den City, thousands of duelists take part in a virtual reality space known as Link Vrains, where users can create unique avatars and participate in games of Duel Monsters with each other. As a mysterious hacker organisation known as the Knights of Hanoi threaten this world, a high-school student named Yusaku Fujiki battles against them under the guise of Playmaker. \r\n\r\nOne day, Yusaku encounters a peculiar artificial intelligence program, which he names Ai, who sets off a digital maelstrom in Link Vrains known as the Data Storm. As the appearance of this storm gives birth to Speed Duels, in which duelists surf the wind as they duel, Yusaku battles against Hanoi in order to uncover the truth concerning an incident that happened to him years ago.\r\n\r\n(Source: ASCII.jp)",
      type: "TV",
      airing_start: "2017-05-10T09:25:00+00:00",
      episodes: 120,
      members: 28904,
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 11,
          type: "anime",
          name: "Game",
          url: "https://myanimelist.net/anime/genre/11/Game",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      source: "Card game",
      producers: [
        {
          mal_id: 36,
          type: "anime",
          name: "Gallop",
          url: "https://myanimelist.net/anime/producer/36/Gallop",
        },
      ],
      score: 6.7,
      licensors: [],
      r18: false,
      kids: false,
      continuing: true,
    },
    {
      mal_id: 19157,
      url: "https://myanimelist.net/anime/19157/Youkai_Watch",
      title: "Youkai Watch",
      image_url: "https://cdn.myanimelist.net/images/anime/6/58137.jpg",
      synopsis:
        "Primary school student Keita Amano's curiosity is as innocent as any other child's his age. But when one day he decides to venture deeper into the forest, he encounters a small and mysterious capsule. Out from its depths comes Whisper. After 190 years of imprisonment, this ghost-like creature is glad that someone has been kind enough to set him free. He decides to reward Keita by becoming his guardian against supernatural forces. Whisper is one of many Youkai that exist in the world, and provides Keita with a special Youkai Watch, which enables him to see and interact with all the other Youkai.\r\n\r\nYoukai Watch follows Keita, Whisper and the cat spirit Jibanyan as they encounter Youkai, befriend them, fix all the trouble that they so often cause, and, with the help of the watch, use the powers of previously encountered Youkai to aid them. Young Keita may have been just an ordinary primary school student when he first encountered the Youkai, but the many adventures that follow his discovery provide him with invaluable experiences and precious life lessons that help him grow.",
      type: "TV",
      airing_start: "2014-01-08T09:30:00+00:00",
      episodes: 214,
      members: 16554,
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 6,
          type: "anime",
          name: "Demons",
          url: "https://myanimelist.net/anime/genre/6/Demons",
        },
        {
          mal_id: 15,
          type: "anime",
          name: "Kids",
          url: "https://myanimelist.net/anime/genre/15/Kids",
        },
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
      ],
      source: "Game",
      producers: [
        {
          mal_id: 28,
          type: "anime",
          name: "OLM",
          url: "https://myanimelist.net/anime/producer/28/OLM",
        },
      ],
      score: 6.65,
      licensors: ["Dentsu Entertainment USA"],
      r18: false,
      kids: true,
      continuing: true,
    },
  ];
  constructor() {}

  ngOnInit() {}
}
