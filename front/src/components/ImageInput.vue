<template>
  <div class="image-input">
      <label for="imageDesc">Enter an Image Description</label>
      <input type="text" name="imageDesc" id="">
      <input type="file" name="" id="">
  </div>
</template>

<script>
export default {
data() {
    return {

    }
}
}
</script>

<style lang="scss">
.image-input {
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 8rem;

    & input {
        margin: 1rem 0;
    }
}
</style>