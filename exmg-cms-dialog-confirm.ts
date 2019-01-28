import {customElement, html, LitElement, property, query} from 'lit-element';
import '@polymer/paper-dialog';
import '@polymer/paper-button';
import '@polymer/paper-progress';
import '@polymer/iron-form';
import '@polymer/paper-icon-button';
import {exmgDialogStyles} from './exmg-cms-dialog-styles';

@customElement('exmg-cms-dialog-confirm')
export class ExmgConfirmDialog extends LitElement {
  /**
   * Title of the dialog
   */
  @property({type: String})
  public title: string = '';

  /**
   * Dialog message to display as confirmation question
   */
  @property({type: String})
  private message: string = '';

  /**
   * Copy for submit button
   */
  @property({type: String, attribute: 'button-copy'})
  private buttonCopy: string = '';

  /**
   * Indicator if submit is in progress This boolean will display the progress
   * bar at the bottom of the dialog
   */
  @property({type: Boolean, reflect: true})
  private submitting: boolean = false;

  /**
   * Close icon. Default the close icon from the exmg-icons set. Set this property
   * if you want to use a different icon set
   */
  @property({type: String, attribute: 'close-icon'})
  private closeIcon: string = 'exmg-icons:close';

  /**
   * When set this will be shown in the error section of the dialog
   */
  @property({type: String, attribute: 'error-message'})
  private errorMessage?: string;

  @query('#dialog')
  private dialogNode?: HTMLElement | any;

  @query('#submitBtn')
  private submitBtnNode?: HTMLElement | any;

  constructor() {
    super();

    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.submit = this.submit.bind(this);
  }

  private onCloseDialog() {
    this.reset();
  }

  public open() {
    if (this.dialogNode) {
      this.dialogNode.open();
    }
  }

  public close() {
    if (this.dialogNode) {
      this.dialogNode.close();
    }
  }

  private reset() {
    this.submitting = false;
    this.errorMessage = undefined;

    if (this.submitBtnNode) {
      this.submitBtnNode.removeAttribute('disabled');
    }
  }

  public error(error: Error) {
    this.submitting = false;
    this.errorMessage = error.message;

    if (this.submitBtnNode) {
      this.submitBtnNode.removeAttribute('disabled');
    }
  }

  public done() {
    // Reset properties when submit is finished
    this.submitting = false;

    if (this.submitBtnNode) {
      this.submitBtnNode.removeAttribute('disabled');
    }

    // Close dialog
    this.close();
  }

  private submit() {
    // reset error message on new submit
    this.errorMessage = undefined;

    // Disabled submit button + display progress bar
    this.submitting = true;

    if (this.submitBtnNode) {
      this.submitBtnNode.setAttribute('disabled', 'disabled');
    }

    // dispatch event
    this.dispatchEvent(new CustomEvent('submit', {bubbles: false, composed: true}));
  }

  protected render() {
    return html`
      ${exmgDialogStyles}
      <paper-dialog id="dialog" with-backdrop no-cancel-on-outside-click @iron-overlay-closed="${this.onCloseDialog}">
        <header>
          <h2 class="title">${this.title}</h2>
          <paper-icon-button icon="${this.closeIcon}" dialog-dismiss></paper-icon-button>
        </header>
        <div class="body">
          <div class="error ${ !!this.errorMessage ? 'show' : '' }">
            <span class="body">
              <span>
                <iron-icon icon="exmg-icons:warning"></iron-icon>
                <span class="msg">${this.errorMessage}</span>
              </span>
            </span>
          </div>
          <p>${this.message}</p>
        </div>
        <div class="actions">
          <paper-button dialog-dismiss>Cancel</paper-button>
          <paper-button id="submitBtn" @click="${this.submit}" class="primary">${this.buttonCopy}</paper-button>
        </div>
        ${this.submitting ? html`<paper-progress indeterminate></paper-progress>` : ''}
      </paper-dialog>
    `;
  }
}
