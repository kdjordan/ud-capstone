<template>
  <div class="image-input">
      <h3>Upload a New Image</h3>
      <div>
        <label for="imageDesc">Image Description</label>
        <input type="text" name="imageDesc">
      </div>
      <div>
        <label for="groups">Group</label>
        <input type="text" name="groups">
      </div>
      <input type="file" name="">
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    border-bottom: 1px solid var(--color-black);

    & label {
        margin-right: .5rem;
    }

    & input {
        margin: 1rem 0;
    }
}
</style>