<template>
  <div class="upload-wrapper" @click="handleUploadClick">
    <svg
      class="upload-icon" viewBox="0 0 1024 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      <path d="M800 992.512 224 992.512C153.312 992.512 96 935.2 96 864.512L96 160.512C96 89.824 153.312 32.512 224 32.512L635.616 32.512C646.688 30.432 658.448 33.04 667.024 41.6L916.704 291.28C922.256 296.816 925.456 303.76 926.544 310.96 927.488 313.968 928 317.184 928 320.512L928 864.512C928 935.2 870.688 992.512 800 992.512ZM672 146.448 672 288.512 814.064 288.512 672 146.448ZM864 352.512 640 352.512C622.32 352.512 608 338.192 608 320.512L608 96.512 224 96.512C188.656 96.512 160 125.168 160 160.512L160 864.512C160 899.856 188.656 928.512 224 928.512L800 928.512C835.344 928.512 864 899.856 864 864.512L864 352.512ZM704 608.512 544 608.512 544 768.512C544 786.192 529.664 800.512 512 800.512 494.32 800.512 480 786.192 480 768.512L480 608.512 320 608.512C302.32 608.512 288 594.192 288 576.512 288 558.832 302.32 544.512 320 544.512L480 544.512 480 384.512C480 366.832 494.32 352.512 512 352.512 529.664 352.512 544 366.832 544 384.512L544 544.512 704 544.512C721.68 544.512 736 558.832 736 576.512 736 594.192 721.68 608.512 704 608.512Z" />
    </svg>
    <!--  -->
    <input
      id="FileInput" ref="FileInput"
      type="file" accept=".mid"
      @change="handleFileChange">
  </div>
</template>

<script>
export default {
  methods: {
    handleUploadClick() {
      this.$refs.FileInput.click()
    },
    handleFileChange(e) {
      if (e.target.files && e.target.files.length) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = evt => {
          this.$emit('parse-upload-file', file.name, evt.target.result)
        }
        reader.readAsArrayBuffer(file)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-wrapper {
  display: flex;
  margin-right: 8px;
  transition: opacity 0.3s;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  .upload-icon {
    width: 18px;
    height: 18px;
    fill: #e0e0e0;
  }
}

#FileInput {
  position: fixed;
  top: -100%;
  right: 100%;
  width: 0;
  height: 0;
  visibility: hidden;
  z-index: -1;
}
</style>
