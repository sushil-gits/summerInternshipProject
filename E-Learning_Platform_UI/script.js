document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is loaded
    setTimeout(function() {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loader').style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentIndex);
    }

    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    // Auto slide testimonials
    let testimonialInterval = setInterval(nextTestimonial, 5000);

    // Pause auto slide on hover
    const slider = document.querySelector('.testimonials-slider');
    slider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    slider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    });

    // Course data
    const coursesData = [
        {
            title: "Web Development Bootcamp",
            category: "Development",
            instructor: "John Smith",
            instructorImg: "https://randomuser.me/api/portraits/men/1.jpg",
            students: 1250,
            lessons: 45,
            duration: "32 hours",
            price: 99,
            oldPrice: 199,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Data Science Fundamentals",
            category: "Data Science",
            instructor: "Sarah Johnson",
            instructorImg: "https://randomuser.me/api/portraits/women/1.jpg",
            students: 890,
            lessons: 36,
            duration: "28 hours",
            price: 129,
            oldPrice: 249,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Mobile App Design",
            category: "Design",
            instructor: "Michael Chen",
            instructorImg: "https://randomuser.me/api/portraits/men/2.jpg",
            students: 750,
            lessons: 30,
            duration: "24 hours",
            price: 89,
            oldPrice: 149,
            image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Digital Marketing Masterclass",
            category: "Marketing",
            instructor: "Emma Wilson",
            instructorImg: "https://randomuser.me/api/portraits/women/2.jpg",
            students: 1100,
            lessons: 42,
            duration: "35 hours",
            price: 79,
            oldPrice: 129,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Python for Beginners",
            category: "Programming",
            instructor: "David Brown",
            instructorImg: "https://randomuser.me/api/portraits/men/3.jpg",
            students: 2300,
            lessons: 50,
            duration: "40 hours",
            price: 59,
            oldPrice: 99,
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "UX/UI Design Principles",
            category: "Design",
            instructor: "Lisa Wong",
            instructorImg: "https://randomuser.me/api/portraits/women/3.jpg",
            students: 680,
            lessons: 28,
            duration: "22 hours",
            price: 109,
            oldPrice: 179,
            image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ];

    // Render courses
    const coursesGrid = document.querySelector('.courses-grid');
    
    coursesData.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.style.animationDelay = `${index * 0.1}s`;
        
        courseCard.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <div class="course-instructor">
                    <img src="${course.instructorImg}" alt="${course.instructor}">
                    <span>${course.instructor}</span>
                </div>
                <div class="course-meta">
                    <span><i class="fas fa-users"></i> ${course.students} Students</span>
                    <span><i class="fas fa-play-circle"></i> ${course.lessons} Lessons</span>
                </div>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span class="course-price">$${course.price} <span class="old-price">$${course.oldPrice}</span></span>
                </div>
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements when scrolling
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.course-card, .feature-card, .section-header');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check in case elements are already in view
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});