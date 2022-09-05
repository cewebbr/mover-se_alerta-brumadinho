import { notification } from "antd";

export const successNotification = (message) => {
  notification.success({
    message: "Sucesso!",
    description: message || "Ação realizada com sucesso.",
  });
};

export const errorNotification = (message) => {
  notification.error({
    message: "Erro!",
    description: message || "Algum erro aconteceu. Tente novamente.",
  });
};
