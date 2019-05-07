/* global SuwonDefender */

SuwonDefender.settings.menu = [
  {
    type: 'optiongroup',
    name: 'DEFCON',
    options: [
      'DEFCON 5',
      'DEFCON 4',
      'DEFCON 3',
      'DEFCON 2',
      'DEFCON 1'
    ]
  },
  {
    type: 'optiongroup',
    name: 'WATCHCON',
    options: [
      'WATCHCON 5',
      'WATCHCON 4',
      'WATCHCON 3',
      'WATCHCON 2',
      'WATCHCON 1'
    ]
  },
  {
    type: 'boolean',
    name: '경계 상태'
  },
  {
    type: 'boolean',
    name: '긴급 상태'
  },
  {
    type: 'boolean',
    name: '특수 상태'
  },
  {
    type: 'booleangroup',
    name: '주요 시설',
    booleans: [
      {
        type: 'boolean',
        name: '행정 시설',
        image: 'offices'
      },
      {
        type: 'boolean',
        name: '교통 시설',
        image: 'yellowdots'
      },
      {
        type: 'boolean',
        name: '구역별 배치도',
        image: 'boundary',
        imageMap: true
      }
    ]
  }
];
