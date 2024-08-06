import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="dummy_server",
    version="0.0.1",
    description="Backend for the dummy project of the XAI-IML 2024 course.",
    long_description=read("README.md"),
    classifiers=[
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Development Status :: 4 - Beta",
    ],
    entry_points={
        "console_scripts": [
            "start-server = dummy_server.router.app:start_server",
        ]
    },
    install_requires=[
        "Flask>=2.0.0",
        "flask-restful>=0.3.9",
        "flask-cors>=3.0.10",
        "pandas>=1.4.1",
        "scikit-learn>=1.0.2",
        "psutil>=5.9.0"
    ],
    packages=find_packages(where="src", include=["dummy_server*"]),
    package_dir={"": "src"},
)