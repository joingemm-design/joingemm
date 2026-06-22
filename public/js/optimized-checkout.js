// Optimized checkout flow function
async function optimizedCheckoutFlow(button) {
  // Track button click
  if (window.gemmMonitor) {
    window.gemmMonitor.trackButtonClick();
  }
  
  // Show loading state
  button.classList.add('loading');
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = 'Loading Checkout...';
  
  try {
    // Get event data from button attributes
    const eventId = button.dataset.eventId;
    const price = button.dataset.price;
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Redirect to checkout page
    window.location.href = `/events/${eventId}/checkout`;
    
  } catch (error) {
    console.error('Checkout error:', error);
    button.textContent = 'Try Again';
    button.classList.remove('loading');
    button.disabled = false;
    
    // Reset button after 3 seconds
    setTimeout(() => {
      button.textContent = originalText;
    }, 3000);
  }
}

// Preload checkout resources on user interaction
let checkoutPreloaded = false;
document.addEventListener('mouseover', function(e) {
  if (e.target.classList.contains('ticket-button') && !checkoutPreloaded) {
    // Prefetch checkout page
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/checkout';
    document.head.appendChild(link);
    
    checkoutPreloaded = true;
    console.log('🚀 Preloaded checkout resources');
  }
}, { once: true });

// Track when checkout page loads
if (window.location.pathname.includes('/checkout')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.gemmMonitor) {
      window.gemmMonitor.trackCheckoutLoaded();
    }
  });
}
