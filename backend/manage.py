#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


# def run_django():
#     from django.core.management import execute_from_command_line
#     execute_from_command_line(sys.argv)
def run_django():
    from django.core.management import execute_from_command_line
    print('--------manage.py/run_django():-------')
    args = sys.argv.copy()
    if "runserver" in args:
        args.append("--noreload")
    execute_from_command_line(args)



def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    print('--------manage.py/main():-------')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(...) from exc

    if len(sys.argv) > 1 and sys.argv[1] == "runserver":
        import multiprocessing
        import uvicorn
        print('--------manage.py/main()/if len(sys...:-------')

        p = multiprocessing.Process(target=run_django)
        p.start()

        # ❗ Сокеты всегда на 8002
        uvicorn.run("backend.socketio.server:app", host="127.0.0.1", port=8002)
        p.join()

    else:
        execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
