export function showTooltip(event) {
		const el = (event.target).closest<HTMLElement>('[data-tooltip]');
		if (!el) return;

		tooltipContent = el.dataset.tooltip ?? '';
		const r = el.getBoundingClientRect();
		tooltipX = r.left + window.scrollX;
		tooltipY = r.bottom + 8 + window.scrollY;
		tooltipVisible = true;
	}

export function hideTooltip(event) {
        // Only hide if we're not moving to another glossary term
        /*
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('glossary-term')) {
            tooltipVisible = false;
        }*/
        tooltipVisible = false;
    }

export function moveTooltip(event) {
    if (tooltipVisible) {
        positionTooltip(event);
    }
}

export function positionTooltip(event) {
    const tooltipElement = document.querySelector('.glossary-tooltip');
    if (!tooltipElement) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const offset = 10; // Distance from cursor
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get tooltip dimensions
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    
    // Calculate available space in each direction
    const spaceRight = viewportWidth - mouseX;
    const spaceLeft = mouseX;
    const spaceBottom = viewportHeight - mouseY;
    const spaceTop = mouseY;
    
    // Determine horizontal position
    let x;
    if (spaceRight >= tooltipWidth + offset) {
        // Enough space on the right
        x = mouseX + offset;
    } else if (spaceLeft >= tooltipWidth + offset) {
        // Not enough space on right, but enough on left
        x = mouseX - tooltipWidth - offset;
    } else {
        // Not enough space on either side, choose the side with more space
        if (spaceRight > spaceLeft) {
            x = mouseX + offset;
        } else {
            x = mouseX - tooltipWidth - offset;
        }
        
        // Ensure tooltip doesn't go off-screen
        x = Math.max(5, Math.min(x, viewportWidth - tooltipWidth - 5));
    }
    
    // Determine vertical position
    let y;
    if (spaceBottom >= tooltipHeight + offset) {
        // Enough space below
        y = mouseY + offset;
    } else if (spaceTop >= tooltipHeight + offset) {
        // Not enough space below, but enough above
        y = mouseY - tooltipHeight - offset;
    } else {
        // Not enough space above or below, choose the side with more space
        if (spaceBottom > spaceTop) {
            y = mouseY + offset;
        } else {
            y = mouseY - tooltipHeight - offset;
        }
        
        // Ensure tooltip doesn't go off-screen
        y = Math.max(5, Math.min(y, viewportHeight - tooltipHeight - 5));
    }
    
    // Apply the calculated position
    tooltipX = x;
    tooltipY = y;
}