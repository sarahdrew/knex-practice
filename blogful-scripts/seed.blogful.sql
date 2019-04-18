INSERT INTO blogful_articles (title, date_published, content)
VALUES
    ('Cats',  now() - '21 days'::INTERVAL, 'Here is the article about cats, blah blah blah'),
    ('Dogs', now() -'21 days' ::INTERVAL, 'Here is the article about dogs blah blah blah'),
    ('Ducks', now()-'21 days' ::INTERVAL, 'Here is the article about ducks quack quack quack')