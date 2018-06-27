Component({
  externalClasses: ['i-class'],

  relations: {
      '../tab-bar/index': {
          type: 'parent'
      }
  },

  properties: {
      image: {
          type: String,
          value: ''
      },
      selectedImage: {
          type: String,
          value: ''
      },
      key: {
          type: String,
          value: ''
      },
      title: {
          type: String,
          value: ''
      }
  },

  data: {
      current: false,
      currentColor: ''
  },

  methods: {
      changeCurrent (current) {
          this.setData({ current });
      },
      changeCurrentColor (currentColor) {
          this.setData({ currentColor });
      },
      handleClickItem () {
          const parent = this.getRelationNodes('../tab-bar/index')[0];
          parent.emitEvent(this.data.key);
      }
  }
});