const axios = require("axios");
const config = require("../config");

class ServiceClient {
  static async getService(servicename) {
    try {
      const response = await axios.get(
        `${config.registry.url}/find/${servicename}/${config.registry.version}/`
      );
      if (!response.data.ip) {
        throw new Error(
          `Could not find ${servicename}:${config.registry.version}`
        );
      }
      console.log("getService response:", response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async callService(servicename, requestOptions) {
    const { ip, port } = await this.getService(servicename);
    // eslint-disable-next-line no-param-reassign
    requestOptions.url = `http://${ip}:${port}${requestOptions.url}`;
    console.log("callService requestOptions", requestOptions);
    try {
      const response = await axios(requestOptions);
      return response.data;
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

module.exports = ServiceClient;
