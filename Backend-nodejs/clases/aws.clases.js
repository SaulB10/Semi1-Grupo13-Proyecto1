class S3Params {
    constructor(Bucket, Key, Body, ContentType) {
      this.Bucket = Bucket;
      this.Key = Key;
      this.Body = Body;
      this.ContentType = ContentType;
    }
  }
  
  class S3ParamsGetFile {
    constructor(Bucket, Key) {
      this.Bucket = Bucket;
      this.Key = Key;
    }
  }
  
  module.exports = {
    S3Params,
    S3ParamsGetFile
  };