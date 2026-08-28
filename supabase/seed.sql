-- Optional starter data — matches the sample content that used to ship
-- as local JSON fallback data. Safe to skip or edit before running.

insert into testimonials (name, role, company, avatar, rating, category, quote)
values
  (
    'Sarah Jenkins',
    'Chief Technology Officer',
    'FinTech Dynamics Dubai',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    5,
    'Cloud Infrastructure',
    'The Jobsync transformed our legacy financial systems into a scalable cloud infrastructure with zero downtime. Their technical expertise and strategic guidance were outstanding.'
  ),
  (
    'Marcus Vance',
    'VP of Operations',
    'Apex Health Systems',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    5,
    'Custom Software',
    'Working with The Jobsync felt like extending our internal engineering team. They delivered our HIPAA-compliant client portal ahead of schedule with exceptional quality.'
  );

insert into careers (title, department, type, location, experience, status)
values
  ('Senior Full-Stack Engineer (React / Node.js)', 'Engineering', 'Full-Time', 'Dubai / Remote', '4+ Years', 'Active');

-- Default admin account (change the password immediately after first login).
insert into admin_users (name, email, password, role)
values ('Master Admin', 'admin@thejobsync.com', 'admin123', 'Super Admin')
on conflict (email) do nothing;
