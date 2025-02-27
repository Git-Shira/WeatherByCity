import Sun from '../assets/icons/sun.svg';
import Moon from '../assets/icons/moon.svg';
import SunBehindCloud from '../assets/icons/sun-behind-cloud.svg';
import MoonBehindCloud from '../assets/icons/moon-behind-cloud.svg';
import Cloud from '../assets/icons/cloud.svg';

import Fog from '../assets/icons/fog.svg';
import HeavyFog from '../assets/icons/heavy fog.svg';

import Drizzle from '../assets/icons/drizzle.svg';
import LightRain from '../assets/icons/light rain.svg';
import HeavyRain from '../assets/icons/heavy rain.svg';

import Snow from '../assets/icons/snow.svg';
import LightSnow from '../assets/icons/light snow.svg';
import LightSnowNight from '../assets/icons/light snow - night.svg';
import HeavySnow from '../assets/icons/heavy snow.svg';

import Lightning from '../assets/icons/lightning.svg';
import Storm from '../assets/icons/storm.svg';
import ThunderstormSnow from '../assets/icons/thunderstorm snow.svg';

const weatherIcons = {
  0: { text: "שמיים בהירים", icon: Sun, nightIcon: Moon },

  1: { text: "מעט עננים", icon: SunBehindCloud, nightIcon: MoonBehindCloud },
  2: { text: "מעונן חלקית", icon: SunBehindCloud, nightIcon: MoonBehindCloud },
  3: { text: "מעונן", icon: Cloud },

  45: { text: "ערפל", icon: Fog },
  48: { text: "ערפל עם כפור", icon: HeavyFog },

  51: { text: "טפטוף קל", icon: Drizzle },
  53: { text: "טפטוף בינוני", icon: LightRain },
  55: { text: "טפטוף חזק", icon: HeavyRain },

  56: { text: "טפטוף קל עם כפור", icon: Drizzle },
  57: { text: "טפטוף בינוני עם כפור", icon: LightRain },

  61: { text: "גשם קל", icon: Drizzle },
  63: { text: "גשם בינוני", icon: LightRain },
  65: { text: "גשם כבד", icon: HeavyRain },

  66: { text: "גשם קל עם כפור", icon: LightRain },
  67: { text: "גשם כבד עם כפור", icon: HeavyRain },

  71: { text: "שלג קל", icon: LightSnow, nightIcon: LightSnowNight },
  73: { text: "שלג בינוני", icon: HeavySnow },
  75: { text: "שלג כבד", icon: Snow },

  80: { text: "גשם שוטף קל", icon: LightRain },
  81: { text: "גשם שוטף בינוני", icon: LightRain },
  82: { text: "גשם שוטף כבד", icon: HeavyRain },

  85: { text: "שלג שוטף קל", icon: HeavySnow },
  86: { text: "שלג שוטף כבד", icon: Snow },

  95: { text: "סופות רעמים", icon: Lightning },
  96: { text: "סופות רעמים עם ברד קל", icon: Storm },
  99: { text: "סופות רעמים עם ברד כבד", icon: ThunderstormSnow }
};

export default weatherIcons;
