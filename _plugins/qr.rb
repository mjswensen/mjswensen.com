require "rqrcode"

module Jekyll
  class RenderQrCodeTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @qr = RQRCode::QRCode.new(text)
    end

    def render(context)
      @qr.as_svg(viewbox: true, svg_attributes: {class: 'qr-code'})
    end
  end
end

Liquid::Template.register_tag('qr', Jekyll::RenderQrCodeTag)
