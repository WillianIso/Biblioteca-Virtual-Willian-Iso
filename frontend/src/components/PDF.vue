<template>
  <iframe :src="pdfUrl" width="100%" height="600px"></iframe>
</template>

<script>
export default {
  props: ["pdfUrlReal"],
  data() {
    return {
      pdfUrl: "/uploads/exemplo.pdf",
    };
  },
  mounted() {
    this.pdfUrl = this.pdfUrlReal;
  },
};
</script>
