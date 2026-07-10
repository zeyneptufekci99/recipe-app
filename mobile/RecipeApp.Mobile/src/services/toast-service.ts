import Toast from "react-native-toast-message";

export const toastService = {
  success(title: string, message?: string) {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      position: "bottom",
    });
  },

  error(title: string, message?: string) {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      position: "bottom",
    });
  },

  info(title: string, message?: string) {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      position: "bottom",
    });
  },
};
