
const addEventBtn = document.querySelector('.add-event');
const popupOverlay = document.getElementById('popupOverlay');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');

const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');
const eventsList = document.querySelector('.events-list');


let events = [];


function calculateDaysRemaining(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    
  
    const diffTime = target - today;
    
   
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}


function deleteEvent(eventId) {
   
    events = events.filter(function(event) {
        return event.id !== eventId;
    });
    
    saveToStorage();
    displayEvents();
    
    console.log('🗑️ Event deleted!');
}


function saveToStorage() {
    try {
        const eventsJSON = JSON.stringify(events);
        localStorage.setItem('my-events', eventsJSON);
        console.log('✅ Saved to storage!');
    } catch (error) {
        console.error('❌ Save failed:', error);
    }
}


function loadFromStorage() {
    try {
        const eventsJSON = localStorage.getItem('my-events');
        
        if (eventsJSON) {
            events = JSON.parse(eventsJSON);
            console.log('✅ Loaded from storage:', events);
            displayEvents();
        } else {
            console.log('📭 No saved events found');
        }
    } catch (error) {
        console.error('❌ Load failed:', error);
    }
}


function displayEvents() {
    
    eventsList.innerHTML = '';
    
 
    if (events.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); padding: 20px;">No events yet!</p>';
        return;
    }
    
    events.forEach(function(event) {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        // Calculate days remaining
        const daysLeft = calculateDaysRemaining(event.date);
        
        
        const maxDays = 30;
        const percentage = Math.min((daysLeft / maxDays) * 100, 100);
        
        
        const ratio = Math.min(daysLeft / maxDays, 1);
        let red, green;
        
        if (daysLeft > 15) {
            
            red = Math.floor(((30 - daysLeft) / 15) * 200 + 55);
            green = 255;
        } else {
            
            red = 255;
            green = Math.floor((daysLeft / 15) * 200 + 55);
        }
        
        eventCard.innerHTML = `
            <button class="delete-btn" onclick="deleteEvent(${event.id})">×</button>
            <div class="card-content">
                <div class="left-section">
                    <div class="days-number">${daysLeft}</div>
                    <div class="days-label">DAYS</div>
                </div>
                <div class="right-section">
                    <h3>${event.name}</h3>
                    <div class="event-date">${event.date}</div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%; background: rgba(${red}, ${green}, 100, 0.6);"></div>
            </div>
        `;
        
        eventsList.appendChild(eventCard);
    });
}


loadFromStorage();

// Open popup
addEventBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'flex';
});

// Close popup
cancelBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'none';
});

// Save button
saveBtn.addEventListener('click', function(){
    const eventName = eventNameInput.value.trim();
    const eventDate = eventDateInput.value;

    if(eventName && eventDate){
        const newEvent = {
            id: Date.now(),
            name: eventName,
            date: eventDate
        };
        
        events.push(newEvent);
        saveToStorage();
        displayEvents();
        
        console.log('All events:', events);
        
        popupOverlay.style.display = 'none';
        eventNameInput.value = '';
        eventDateInput.value = '';
    }
});
// Handle scroll fade effect
eventsList.addEventListener('scroll', function() {
    const scrollTop = eventsList.scrollTop;
    const scrollHeight = eventsList.scrollHeight;
    const clientHeight = eventsList.clientHeight;
    
    
    eventsList.classList.remove('scrolled-top', 'scrolled-middle', 'scrolled-bottom');
    
    
    if (scrollTop === 0) {
        
        if (scrollHeight > clientHeight) {
            eventsList.classList.add('scrolled-top');
        }
    } else if (scrollTop + clientHeight >= scrollHeight - 5) {
       
        eventsList.classList.add('scrolled-bottom');
    } else {
        
        eventsList.classList.add('scrolled-middle');
    }
});