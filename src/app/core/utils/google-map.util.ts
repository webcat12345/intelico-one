export const mapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  // zoom: 17,
  // center: {lat: 51.5074, lng: 0.1278},
  styles: [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        {
          hue: '#2389FF'
        },
        {
          saturation: -100
        },
        {
          lightness: -30
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#353535'
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          color: '#656565'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#505050'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#808080'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#454545'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [
        {
          hue: '#808080'
        }
      ]
    }
  ]
};

/*export const mapOptionsDark = {

  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  // zoom: 17,
  // center: {lat: 51.5074, lng: 0.1278},
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [
        {
          saturation: '50'
        },
        {
          color: '#000000'
        },
        {
          lightness: 40
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          visibility: 'on'
        },
        {
          color: '#000000'
        },
        {
          lightness: 16
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 20
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 17
        },
        {
          weight: 1.2
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          color: '#232634'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#272a37'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 17
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 29
        },
        {
          weight: 0.2
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 18
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 16
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 19
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#1d2e55'
        },
        {
          lightness: 17
        }
      ]
    }
  ]
};*/

export const mapOptionsDark = {

  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  // zoom: 17,
  // center: {lat: 51.5074, lng: 0.1278},
  styles: [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        {
          invert_lightness: true
        },
        {
          saturation: 10
        },
        {
          lightness: 30
        },
        {
          gamma: 0.5
        },
        {
          hue: '#00b5ff'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#00c3f1'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry.fill',
      stylers: [
        {
          visibility: 'on'
        },
        {
          color: '#0b2936'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#20c4ef'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [
        {
          color: '#20c4ef'
        }
      ]
    },
    {
      featureType: 'poi.business',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#20c4ef'
        }
      ]
    },
    {
      featureType: 'poi.business',
      elementType: 'labels.icon',
      stylers: [
        {
          weight: '1.83'
        },
        {
          hue: '#00caff'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#3c484d'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#000000'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          hue: '#ff0000'
        },
        {
          visibility: 'off'
        }
      ]
    }
  ]
};
