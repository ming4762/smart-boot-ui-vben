import { acceptHMRUpdate, defineStore } from 'pinia';

interface ApiExceptionState {
  exceptionNoList: number[];
  modalShow: boolean;
}

/**
 * 接口异常处理
 */
export const useApiExceptionStore = defineStore('api-exception', {
  actions: {
    handleHide() {
      this.exceptionNoList = [];
      this.modalShow = false;
    },
    handleShow(exceptionNo: number) {
      if (this.modalShow === false) {
        this.exceptionNoList = [];
      }
      this.modalShow = true;
      this.exceptionNoList.push(exceptionNo);
    },
  },
  state: (): ApiExceptionState => {
    return {
      exceptionNoList: [],
      modalShow: false,
    };
  },
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useApiExceptionStore, hot));
}
