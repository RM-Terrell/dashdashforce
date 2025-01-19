FROM mcr.microsoft.com/devcontainers/typescript-node:latest


# Install dependencies
RUN sudo apt update && sudo apt upgrade -y && \
    sudo apt install -y build-essential checkinstall && \
    sudo apt install -y libpng-dev libjpeg-dev libtiff-dev && \
    sudo apt install -y libx11-dev libxext-dev zlib1g-dev

# Download and build ImageMagick for logo update pipeline
# Comment this stuff out if you're not building new logos
# because these steps dramatically increase devcontainer build time.
RUN cd /usr/local/src && \
    sudo wget https://www.imagemagick.org/download/ImageMagick.tar.gz && \
    sudo tar xvzf ImageMagick.tar.gz && \
    cd ImageMagick-* && \
    sudo ./configure && \
    sudo make && \
    sudo make install && \
    sudo ldconfig && \
    cd /usr/local/src && \
    sudo rm -rf ImageMagick*

# Verify installation
RUN magick --version