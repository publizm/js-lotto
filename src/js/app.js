import {
  isValidAmountUnit,
  isValidClickEventTarget,
  isValidSubmitEventTarget,
} from "./utils.js";
import { MESSAGE_ABOUT_UNIT_OF_AMOUNT } from "./constants.js";

class App {
  #model;
  #view;

  constructor({ target, model, view }) {
    this.$target = document.querySelector(target);
    this.#model = model;
    this.#view = view;

    this.clickHandler = {
      "create-manual-lotto-button": () => {
        this.#view.addManualLotto();
        this.#model.createManualLotto();
      },
      "view-numbers-checkbox": (e) => {
        this.#view.onViewNumbers(e.target.checked);
      },
      modal: () => {
        if (!this.#view.isResultModalOpened) {
          this.openModal();
        } else {
          this.closeModal();
        }
      },
      "modal-close": () => {
        this.closeModal();
      },
      "reset-lotto-button": () => {
        this.reset();
      },
    };
    this.submitHandler = {
      "purchase-input-form": () => {
        if (!isValidAmountUnit(this.#view.$amountInput.value)) {
          alert(MESSAGE_ABOUT_UNIT_OF_AMOUNT);
          return;
        }

        this.#model.purchaseLotto(this.#view.$amountInput.value);
        this.render(this.#model.state);
      },
      "winning-number-confirmation-form": () => {
        const isValidNumbers = this.#model.isValidNumbers(
          this.#view.$winningInputs,
          this.#view.$bonusInput
        );

        if (!isValidNumbers) return;

        this.#model.checkWinnerNumber(
          this.#view.$winningInputs,
          this.#view.$bonusInput
        );

        this.openModal();
      },
    };

    this.setEvent();
  }

  handledSubmit = (e) => {
    e.preventDefault();
    if (!isValidSubmitEventTarget(e.target)) return;
    this.submitHandler[e.target.id]();
  };

  handledClick = (e) => {
    if (!isValidClickEventTarget(e.target)) return;
    e.stopPropagation();

    this.clickHandler[e.target.id](e);
  };

  setEvent() {
    this.$target.addEventListener("submit", this.handledSubmit);
    this.$target.addEventListener("click", this.handledClick);
  }

  openModal() {
    this.#view.renderModal(this.#model.state.winningStatistics);
  }

  closeModal() {
    this.#view.handledCloseResultModal();
  }

  render(state) {
    this.#view.render(state);
  }

  reset() {
    this.#view.reset();
  }
}
export default App;
