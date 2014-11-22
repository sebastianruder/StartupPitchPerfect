import webapp2
from webapp2_extras import jinja2


class MainHandler(webapp2.RequestHandler):

    def render_response(self, template, **context):
        renderer = jinja2.get_jinja2(app=self.app)
        rendered_value = renderer.render_template(template, **context)
        self.response.write(rendered_value)

    def get(self):
        self.render_response('index.html')

application = webapp2.WSGIApplication([
    ('/', MainHandler)
    ], debug=True)
