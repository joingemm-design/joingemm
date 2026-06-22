/**
 * GEMM Checkout Performance Monitoring
 */
class GemmCheckoutMonitor {
  constructor() {
    this.metrics = {
      buttonClickTime: null,
      checkoutStartTime: null,
      checkoutLoadTime: null,
      paymentStartTime: null,
      completionTime: null
    };
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      const ticketButtons = document.querySelectorAll('.ticket-button, [data-action="buy-tickets"]');
      ticketButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.trackButtonClick();
        });
      });
    });
  }

  trackButtonClick() {
    this.metrics.buttonClickTime = performance.now();
    if (typeof gtag !== 'undefined') {
      gtag('event', 'checkout_button_click', {
        event_category: 'ecommerce',
        event_label: 'ticket_purchase_start'
      });
    }
    console.log('🎫 Ticket button clicked at:', this.metrics.buttonClickTime);
  }

  trackCheckoutLoaded() {
    this.metrics.checkoutLoadTime = performance.now();
    const loadTime = this.metrics.checkoutLoadTime - this.metrics.buttonClickTime;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: 'checkout_load_time',
        value: Math.round(loadTime),
        event_category: 'performance'
      });
    }
    console.log('📊 Checkout loaded in:', Math.round(loadTime), 'ms');
  }

  trackPurchaseComplete(orderValue, ticketCount) {
    this.metrics.completionTime = performance.now();
    const totalTime = this.metrics.completionTime - this.metrics.buttonClickTime;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: orderValue,
        currency: 'USD',
        event_category: 'ecommerce'
      });
    }
    console.log('✅ Purchase completed in:', Math.round(totalTime), 'ms');
  }

  getPerformanceReport() {
    return {
      buttonToCheckout: this.metrics.checkoutLoadTime - this.metrics.buttonClickTime,
      totalTime: this.metrics.completionTime - this.metrics.buttonClickTime,
      metrics: this.metrics
    };
  }
}

// Initialize
window.gemmMonitor = new GemmCheckoutMonitor();
window.GemmCheckoutMonitor = window.gemmMonitor;
