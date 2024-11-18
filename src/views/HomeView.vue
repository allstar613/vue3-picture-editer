<template>
  <div class="image-editor">
    <div class="editor-area">
      <div class="select-image-area">
        <label for="formFileSm" class="form-label">Select Image</label>
        <input
          class="form-control form-control-sm"
          id="formFileSm"
          type="file"
          @change="onFileChange"
        />
      </div>

      <div class="control-area">
        <div class="card">
          <div class="card-header">
            <div
              data-bs-toggle="collapse"
              data-bs-target="#collapseCrop"
              aria-expanded="true"
              aria-controls="collapseCrop"
            >
              Crop
            </div>
          </div>

          <div class="collapse show" id="collapseCrop">
            <div class="card-body">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="controlAutoCrop"
                  v-model="cropperOptions.autoCrop"
                  @change="changeCropStatus"
                />
                <label class="form-check-label" for="controlAutoCrop"> Show Crop </label>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div
              data-bs-toggle="collapse"
              data-bs-target="#collapseFilter"
              aria-expanded="true"
              aria-controls="collapseFilter"
            >
              Filter
            </div>
          </div>

          <div class="collapse show" id="collapseFilter">
            <div class="card-body">
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="currentSelectedFilter"
                @change="filterImage"
              >
                <option v-for="filter in filterOptions" :key="filter.value" :value="filter.filter">
                  {{ filter.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div
              data-bs-toggle="collapse"
              data-bs-target="#collapseFilter"
              aria-expanded="true"
              aria-controls="collapseFilter"
            >
              Rotate - {{ rotate }}
            </div>
          </div>

          <div class="collapse show" id="collapseFilter">
            <div class="card-body">
              <input
                type="range"
                v-model="rotate"
                class="form-range"
                min="0"
                max="360"
                @change="rotateImage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview-area">
      <div class="toolbar-area">
        <div class="icon-btn" @click="undoChange">
          <icon class="icon" iconName="undo" :class="[{ active: imageUrlForReturn.length > 0 }]">
          </icon>
        </div>
        <div class="icon-btn" @click="redoChange">
          <icon class="icon" iconName="redo"> </icon>
        </div>

        <div class="icon-btn ms-3" @click="doCrop">
          <icon class="icon" iconName="crop" :class="[{ active: cropperOptions.autoCrop }]"> </icon>
        </div>
      </div>
      <vue-cropper
        ref="cropper"
        :img="imageUrl"
        v-bind="cropperOptions"
        :default-rotate="rotate"
        :wrapper="wrapper"
      >
      </vue-cropper>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const cropper = ref()

const cropperOptions = ref({
  autoCropWidth: 200,
  autoCropHeight: 150,
  autoCrop: false,
  limitMinSize: [50, 50],
  size: 1,
  full: false,
  outputType: 'png',
  canMove: true,
  fixedBox: false,
  original: false,
  canMoveBox: true,
  high: false,
  cropData: {},
  enlarge: 1,
  mode: 'contain',
  maxImgSize: 3000,
  fixed: false,
  fixedNumber: [2, 1],
  fillColor: '',
})

let rotate = ref(0)

const imageUrl = ref(
  'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg',
)
const imageUrlForReturn = ref([])
let undoIndex = ref(0)

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageUrlForReturn.value = []
    undoIndex.value = 0
    imageUrlForReturn.value.push(imageUrl.value)
    undoIndex.value++
    imageUrl.value = URL.createObjectURL(file)
    currentSelectedFilter.value = 'none'
  }
}

const changeCropStatus = () => {
  if (!cropperOptions.value.autoCrop) {
    cropper.value.clearCrop()
  }
}

const doCrop = async () => {
  cropper.value.getCropData((data) => {
    imageUrlForReturn.value.push(imageUrl.value)
    undoIndex.value++
    imageUrl.value = data
  })
}

const filterOptions = ref([
  { label: '無濾鏡', value: 0, filter: 'none' },
  { label: '黑白濾鏡', value: 1, filter: 'grayscale(100%)' },
  { label: '老照片濾鏡', value: 2, filter: 'sepia(100%)' },
  { label: '模糊濾鏡', value: 3, filter: 'blur(5px)' },
  { label: '亮度濾鏡', value: 4, filter: 'brightness(150%)' },
  { label: '對比濾鏡', value: 5, filter: 'contrast(200%)' },
  { label: '飽和度濾鏡', value: 6, filter: 'saturate(200%)' },
  { label: '反轉濾鏡', value: 7, filter: 'invert(100%)' },
  { label: '陰影濾鏡', value: 8, filter: 'drop-shadow(16px 16px 20px red)' },
  { label: '褐色濾鏡', value: 9, filter: 'sepia(60%)' },
  { label: '透明濾鏡', value: 10, filter: 'opacity(50%)' },
  { label: '暖色濾鏡', value: 11, filter: 'hue-rotate(90deg)' },
  { label: '冷色濾鏡', value: 12, filter: 'hue-rotate(-90deg)' },
])

const currentSelectedFilter = ref('none')

const applyCanvasEffect = (canvas, filter) => {
  const ctx = canvas.getContext('2d')
  ctx.filter = filter
  ctx.drawImage(canvas, 0, 0)
}

const filterImage = () => {
  cropper.value.getCropData((data) => {
    const img = new Image()
    img.src = data
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      applyCanvasEffect(canvas, currentSelectedFilter.value)

      imageUrlForReturn.value.push(imageUrl.value)
      undoIndex.value++
      imageUrl.value = canvas.toDataURL()
    }
    img.onerror = (error) => {
      console.error('Image loading error:', error)
    }
  })
}

//- 旋轉圖片
const rotateImage = () => {
  cropper.value.getCropData((data) => {
    const img = new Image()
    img.src = data
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.translate(img.width / 2, img.height / 2)
      ctx.rotate((rotate.value * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      imageUrlForReturn.value.push(imageUrl.value)
      undoIndex.value++
      imageUrl.value = canvas.toDataURL()
    }
    img.onerror = (error) => {
      console.error('Image loading error:', error)
    }
  })
}

//-------------------------------------
const undoChange = () => {
  if (undoIndex.value !== 0) {
    imageUrl.value = imageUrlForReturn.value[undoIndex.value - 1]
    undoIndex.value--
  }
}

const redoChange = () => {
  if (undoIndex.value < imageUrlForReturn.value.length - 1) {
    imageUrl.value = imageUrlForReturn.value[undoIndex.value + 1]
    undoIndex.value++
  }
}
</script>

<style lang="scss" scoped>
$image-editor-bg-color: #2a2a2a;
$image-editor-text-color: #cccccc;
$image-editor-border-color: #444444;
$image-editor-active-icon-color: #c0c0c0;
$image-editor-hover-icon-color: #e8eaed;

.image-editor {
  display: flex;
  height: 100%;

  .editor-area {
    padding: 20px;
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .select-image-area {
      margin-bottom: 20px;
    }

    .control-area {
      overflow: auto;
      flex-grow: 1;
      margin-bottom: 20px;
    }
  }

  .preview-area {
    justify-content: center;
    flex-grow: 1;
    overflow: auto;

    .toolbar-area {
      height: 50px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }
  }
}

.card {
  background-color: $image-editor-bg-color;
  color: $image-editor-text-color;
  border: 1px solid $image-editor-border-color;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 20px;

  .card-header {
    color: #ffffff;
    padding: 4px 8px;
    border: none;
  }
  .card-body {
    border-top: 2px solid $image-editor-border-color;
    background-color: $image-editor-bg-color;
    color: $image-editor-text-color;
    padding: 16px;
  }
}

.icon-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;

  .icon {
    width: 24px;
    height: 24px;
    fill: #6c757d;

    &.active {
      fill: $image-editor-active-icon-color;
    }
  }

  &:hover {
    .icon {
      fill: $image-editor-hover-icon-color;
    }
  }
}
</style>
