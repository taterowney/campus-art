document.addEventListener('DOMContentLoaded', () => {
    const definitionElements = document.querySelectorAll('.definition');

    definitionElements.forEach(elem => {
        let tooltip = null;
        let hideTimeout;

        const hideTooltipWithDelay = () => {
            hideTimeout = setTimeout(() => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            }, 200);
        };

        const cancelHide = () => {
            clearTimeout(hideTimeout);
        };

        elem.addEventListener('mouseover', (event) => {
            cancelHide();
            if (tooltip) return;

            const termId = elem.id;
            const definitionId = termId + '-def';
            const definitionContent = document.getElementById(definitionId);

            if (definitionContent) {
                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerHTML = definitionContent.innerHTML;
                
                tooltip.addEventListener('mouseover', cancelHide);
                tooltip.addEventListener('mouseout', hideTooltipWithDelay);
                
                document.body.appendChild(tooltip);

                // Typeset MathJax content in the tooltip
                if (window.MathJax) {
                    window.MathJax.typesetPromise([tooltip]);
                }

                const elemRect = elem.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();

                let top = elemRect.top + window.scrollY - tooltipRect.height - 10;
                let left = elemRect.left + window.scrollX + (elemRect.width / 2) - (tooltipRect.width / 2);

                // Adjust if tooltip goes off-screen
                if (left < 0) left = 5;
                if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - 5;
                if (top < window.scrollY) top = elemRect.bottom + window.scrollY + 10;


                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
            }
        });

        elem.addEventListener('mouseout', hideTooltipWithDelay);
    });

    // Swap out cmu logo on narrow screen (it's too wide :| )
    const cmuLogo = document.getElementById('cmu-logo');
    const largeLogoSrc = 'public/CMU_large.png';
    const smallLogoSrc = 'public/CMU_small.png';

    const checkLogo = () => {
        if (window.innerWidth < 800) {
            if (cmuLogo.src !== smallLogoSrc) {
                cmuLogo.src = smallLogoSrc;
            }
        } else {
            if (cmuLogo.src !== largeLogoSrc) {
                cmuLogo.src = largeLogoSrc;
            }
        }
    };

    // Initial check
    checkLogo();

    // Check on resize
    window.addEventListener('resize', checkLogo);
});
