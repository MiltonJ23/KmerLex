install:
	pip install -r requirements.txt

test:
	python -m pytest tests/ -v

run:
	cd web/backend && python app.py